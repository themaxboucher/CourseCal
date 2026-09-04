"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeftFilled } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Loading from "@/components/Loading";
import {
  getEvents as getLocalEvents,
  clearEvents as clearLocalEvents,
} from "@/lib/indexeddb";
import { createEvents, getEvents } from "@/lib/actions/events.actions";
import { getLoggedInUser } from "@/lib/actions/users.actions";
import { localToDBEvents } from "@/lib/utils/upload";
import { captureEvent, identifyUser } from "@/lib/posthog-client";

const INVALID_LINK_MESSAGE = "Invalid login link. Please request a new one.";

/**
 * How recent `users.created_at` has to be for this verification to count as a
 * signup rather than a login. Comfortably longer than the gap between the row
 * being created and the emailed link being opened, and far shorter than the
 * age of any returning user's row.
 */
const NEW_ACCOUNT_WINDOW_MS = 10 * 60 * 1000;

// Separate component that uses useSearchParams() - must be wrapped in Suspense
// This is required in Next.js 15 to handle client-side rendering bailout properly
function VerifyContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams(); // This hook requires Suspense boundary
  const router = useRouter();
  // This effect clears IndexedDB and inserts the events it read from it, so a
  // second pass under React Strict Mode would race the first and duplicate them.
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleVerification = async () => {
      try {
        // `/auth/confirm` redirects here with `?error=` when a token is missing,
        // expired, or already spent.
        if (searchParams.get("error")) {
          setStatus("error");
          setError(INVALID_LINK_MESSAGE);
          return;
        }

        // `/auth/confirm` has already established the session by this point, so
        // the profile row is what tells us who we are.
        const user = await getLoggedInUser();
        if (!user) {
          setStatus("error");
          setError(INVALID_LINK_MESSAGE);
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

        // Identity is asserted here rather than left to the layout of the page
        // we are about to redirect to, because the event below has to land on
        // the person and not on the anonymous visitor who arrived.
        const { id, email, name, username, major } = user;
        identifyUser({ id, email, name, username, major });

        // This page redeems signup and login links alike, and the token says
        // nothing about which it was: the intent stayed behind on
        // `/check-email`, and the link is often opened on a different device
        // than it was requested from. The age of the row is the one signal
        // that survives — a returning user's is days old at the very least.
        const isNewAccount =
          Date.now() - new Date(user.created_at).getTime() <
          NEW_ACCOUNT_WINDOW_MS;
        if (isNewAccount) {
          // Separates the two entry paths on the signup itself: a schedule
          // already in IndexedDB means they uploaded from the landing page
          // before there was an account to attach it to.
          captureEvent("user_signed_up", {
            had_local_schedule: hasLocalEvents,
          });
        }

        setStatus("success");

        // Returning users who already finished onboarding go straight to their
        // schedule. Everyone else resumes onboarding where they left off.
        router.push(
          user.has_completed_onboarding ? "/schedule" : "/onboarding/profile",
        );
      } catch {
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
                  <ArrowLeftFilled className="size-4" /> Back to login
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
