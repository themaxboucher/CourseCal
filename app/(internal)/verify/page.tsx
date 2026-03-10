"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Loading from "@/components/Loading";
import { verifyMagicLink } from "@/lib/actions/auth.actions";

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
        const code = searchParams.get("code");

        if (!code) {
          setStatus("error");
          setError("Invalid login link. Please request a new one.");
          return;
        }

        // Check if the user is authenticated
        const authUser = await verifyMagicLink(code);
        if (!authUser) {
          console.log("Login failed - no authUser");
          setStatus("error");
          setError("Invalid login link. Please request a new one.");
          return;
        }

        setStatus("success");
        router.push("/onboarding/profile");
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
