"use client";

import { useState } from "react";
import { GroupFilled, ScheduleFilled } from "@/components/icons";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { AuthDialog } from "./auth/AuthDialog";
import type { AuthIntent } from "@/lib/actions/auth.actions";

export default function JoinPanel() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authIntent, setAuthIntent] = useState<AuthIntent>("signup");

  function open(intent: AuthIntent) {
    setAuthIntent(intent);
    setAuthOpen(true);
  }

  return (
    <main className="min-h-dvh">
      <header className="flex items-center justify-between px-4 md:px-6 py-4">
        <Logo />
        <Button variant="ghost" size="sm" onClick={() => open("login")}>
          Log in
        </Button>
      </header>

      <section className="mx-auto flex max-w-md flex-col items-center gap-8 px-6 py-16 text-center">
        <div className="space-y-3">
          <p className="text-sm font-medium text-ring">
            You&apos;ve been invited
          </p>
          <h1 className="heading-3 text-balance">
            See when you and your friends are free
          </h1>
          <p className="text-muted-foreground text-balance">
            Upload your UCalgary schedule, add the friend who invited you, and
            CourseCal works out the gaps you share.
          </p>
        </div>

        <ul className="w-full space-y-3 text-left">
          <li className="flex items-start gap-3">
            <ScheduleFilled className="mt-0.5 size-5 shrink-0 text-ring" />
            <span className="text-sm text-muted-foreground">
              Screenshot your schedule and it&apos;s read for you.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <GroupFilled className="mt-0.5 size-5 shrink-0 text-ring" />
            <span className="text-sm text-muted-foreground">
              Overlay friends&apos; weeks to find shared free time.
            </span>
          </li>
        </ul>

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
