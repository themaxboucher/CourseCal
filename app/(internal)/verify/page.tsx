"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Loading from "@/components/Loading";
import { verifyMagicLink } from "@/lib/actions/auth.actions";
import {
  getEvents as getLocalEvents,
  clearEvents as clearLocalEvents,
} from "@/lib/indexeddb";
import { createEvents, getEvents } from "@/lib/actions/events.actions";
import { localToDBEvents } from "@/lib/utils/upload";

// Separate component that uses useSearchParams() - must be wrapped in Suspense
// This is required in Next.js 15 to handle client-side rendering bailout properly
function VerifyContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams(); // This hook requires Suspense boundary
  const router = useRouter();

  useEffect(() => {
    const handleVerification = async () => {
      try {
        const code = searchParams.get("code");

        if (!code) {
          setStatus("error");
          setError("Invalid login link. Please request a new one.");
          return;
        }

        const user = await verifyMagicLink(code);
        if (!user) {
          setStatus("error");
          setError("Invalid login link. Please request a new one.");
          return;
        }

        // Save indexeddb events if they exist
        const localEvents = await getLocalEvents();
        const events = await getEvents(user.id);
        const hasLocalEvents = localEvents.length > 0;
        const hasDBEvents = events.length > 0;

        if (hasLocalEvents) {
          // Clear local events
          await clearLocalEvents();
        }

        // Save indexeddb events to server if they exist
        if (hasLocalEvents && !hasDBEvents) {
          // Convert local events to database events
          const { events: dbEvents, courseColors } = await localToDBEvents(
            localEvents,
            user.id,
          );
          await createEvents(dbEvents, courseColors);
        }

        // If indexeddb events don't exist and server events don't exist,
        // the user will have to upload their schedule during onboarding

        setStatus("success");
        router.push("/onboarding/profile");
      } catch (error) {
        setStatus("error");
        setError("An unknown error occurred. Please try again.");
      }
    };

    handleVerification();
  }, [searchParams, router]);

  return (
    <>
      {status === "loading" && <Loading message="Verifying your login..." />}

      {status === "success" && (
        <Loading message="Login successful! Redirecting..." />
      )}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center gap-4 min-h-[calc(100vh-68px)] w-full">
          <div className="max-w-md w-full flex flex-col items-center justify-center gap-4">
            <p className="text-sm text-destructive bg-destructive/10 p-4 rounded-md">
              {error ?? "An unknown error occurred."}
            </p>
            {error && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="size-4" /> Back to login
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Main component that wraps VerifyContent in Suspense boundary
// This is required in Next.js 15 when using useSearchParams() to prevent build errors
export default function VerifyPage() {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyContent />
    </Suspense>
  );
}
