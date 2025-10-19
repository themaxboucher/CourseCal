"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Loading from "@/components/Loading";
import { createUser, getUser } from "@/lib/actions/users.actions";
import { loginWithMagicLink } from "@/lib/actions/users.actions";

// Separate component that uses useSearchParams() - must be wrapped in Suspense
// This is required in Next.js 15 to handle client-side rendering bailout properly
function VerifyContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams(); // This hook requires Suspense boundary
  const router = useRouter();

  useEffect(() => {
    const handleVerification = async () => {
      try {
        // Debug logging
        console.log("Full URL:", window.location.href);
        console.log("Search params string:", searchParams.toString());
        console.log(
          "All search params:",
          Object.fromEntries(searchParams.entries())
        );

        const userId = searchParams.get("userId");
        const secret = searchParams.get("secret");

        console.log("userId:", userId);
        console.log("secret:", secret);
        console.log("userId type:", typeof userId);
        console.log("secret type:", typeof secret);

        if (!userId || !secret) {
          console.log(
            "Missing parameters - userId:",
            userId,
            "secret:",
            secret
          );
          setStatus("error");
          setError("Invalid login link. Please request a new one.");
          return;
        }

        // Check if the user is authenticated
        const authUser = await loginWithMagicLink(userId, secret);
        if (!authUser) {
          console.log("Login failed - no authUser");
          setStatus("error");
          setError("Invalid login link. Please request a new one.");
          return;
        }

        // Create a user document if it doesn't exist
        const user = await getUser(authUser.$id);
        if (!user) {
          await createUser({
            userId: authUser.$id,
            email: authUser.email,
            hasCompletedOnboarding: false,
            hasBeenWelcomed: false,
          });
        }

        setStatus("success");

        // Add a small delay to ensure the session is properly established
        // This prevents flashing of the homepage during redirect
        setTimeout(() => {
          router.push("/onboarding/profile");
        }, 300);
      } catch (err) {
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
