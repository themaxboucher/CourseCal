"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { AuthDialog } from "./auth/AuthDialog";
import type { AuthIntent } from "@/lib/actions/auth.actions";
import { Navbar } from "./Navbar";

export default function JoinPanel() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authIntent, setAuthIntent] = useState<AuthIntent>("signup");

  function open(intent: AuthIntent) {
    setAuthIntent(intent);
    setAuthOpen(true);
  }

  return (
    <main className="min-h-dvh">
      <Navbar />

      <section className="mx-auto flex max-w-md flex-col items-center gap-8 px-4 md:px-6 py-16 md:pt-24 text-center">
        <div className="space-y-3">
          <p className="text-sm font-medium text-primary">
            You&apos;ve been invited
          </p>
          <h1 className="heading-3 text-balance">
            See when you and your friends are free
          </h1>
          <p className="text-muted-foreground text-balance">
            Upload your schedule, add the friend who invited you, and CourseCal
            works out the free time you share.
          </p>
        </div>

        <div className="w-full space-y-3">
          <Button className="w-full" onClick={() => open("signup")}>
            Create your account
          </Button>
          <p className="text-xs text-muted-foreground">
            Free, and only for @ucalgary.ca addresses.
          </p>
        </div>
      </section>

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        type={authIntent}
      />
    </main>
  );
}
