"use client";

import { useState } from "react";
import { CalendarFold } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import Link from "next/link";
import { AuthDialog } from "./auth/AuthDialog";
import UserAvatar from "./UserAvatar";
import type { Tables } from "@/types/supabase";

interface NavbarProps {
  hasSchedule?: boolean;
  isLoggedIn?: boolean;
  user?: Tables<"users"> | null;
}

export function Navbar({
  hasSchedule = false,
  isLoggedIn = false,
  user = null,
}: NavbarProps) {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogType, setAuthDialogType] = useState<"signup" | "login">(
    "login",
  );
  function handleAuthDialogOpen(type: "signup" | "login") {
    setAuthDialogOpen(true);
    setAuthDialogType(type);
  }
  return (
    <>
      {/* Matches the page container so the logo and account control line up
          with the content below them instead of hugging the window edges. */}
      <header className="relative z-50 w-full">
        <div className="w-full max-w-[90rem] mx-auto px-3 sm:px-4 md:px-8 py-4">
          <div className="flex justify-between items-center gap-3 w-full max-w-[70rem] mx-auto">
            <Logo />
            <div>
              <ul className="flex shrink-0 items-center gap-2">
                {hasSchedule && (
                  <li>
                    <Button size="sm" className="hidden md:flex" asChild>
                      <Link href="/schedule">View Schedule</Link>
                    </Button>
                    <Button size="icon" className="md:hidden" asChild>
                      <Link href="/schedule">
                        <CalendarFold className="size-4.5" />
                      </Link>
                    </Button>
                  </li>
                )}
                {!isLoggedIn && user === null && !hasSchedule && (
                  <>
                    <li>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAuthDialogOpen("login")}
                      >
                        Log in
                      </Button>
                    </li>
                    <li>
                      <Button
                        size="sm"
                        onClick={() => handleAuthDialogOpen("signup")}
                      >
                        Join
                      </Button>
                    </li>
                  </>
                )}
                {user && (
                  <li>
                    <Link
                      href="/settings"
                      className="flex size-11 items-center justify-center md:size-9"
                    >
                      <UserAvatar
                        avatarUrl={user?.avatar}
                        name={user?.name}
                        size="sm"
                      />
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </header>
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        type={authDialogType}
      />
    </>
  );
}
