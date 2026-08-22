"use client";

import { useState } from "react";
import { CalendarFilled, GroupFilled } from "@/components/icons";
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
  /** Incoming friend requests awaiting a response; drives the badge. */
  pendingRequestCount?: number;
}

export function Navbar({
  hasSchedule = false,
  isLoggedIn = false,
  user = null,
  pendingRequestCount = 0,
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
      <header className="flex justify-between items-center gap-2 px-3 sm:px-4 md:px-6 py-4 relative z-50">
        <Logo />
        <div>
          <div>
            <ul className="flex shrink-0 items-center gap-2">
              {isLoggedIn && user && (
                <li>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="relative"
                    aria-label={
                      pendingRequestCount > 0
                        ? `Friends, ${pendingRequestCount} pending request${pendingRequestCount === 1 ? "" : "s"}`
                        : "Friends"
                    }
                    asChild
                  >
                    <Link href="/friends">
                      <GroupFilled className="size-4.5" />
                      {pendingRequestCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[0.625rem] font-semibold leading-4.5 text-white">
                          {pendingRequestCount > 9 ? "9+" : pendingRequestCount}
                        </span>
                      )}
                    </Link>
                  </Button>
                </li>
              )}
              {hasSchedule && (
                <li>
                  <Button size="icon" className="md:invisible" asChild>
                    <Link href="/schedule">
                      <CalendarFilled className="size-4.5" />
                    </Link>
                  </Button>
                  <Button size="sm" className="invisible md:visible" asChild>
                    <Link href="/schedule">
                      <CalendarFilled className="size-4.5" />
                      <span>View schedule</span>
                    </Link>
                  </Button>
                </li>
              )}
              {!isLoggedIn && user === null && !hasSchedule && (
                <>
                  <li>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAuthDialogOpen("login")}
                    >
                      Log in
                    </Button>
                  </li>
                  <li>
                    <Button
                      size="sm"
                      className="hidden sm:inline-flex"
                      onClick={() => handleAuthDialogOpen("signup")}
                    >
                      Join
                    </Button>
                  </li>
                </>
              )}
              {isLoggedIn && user && (
                <li>
                  <Link href="/settings">
                    <UserAvatar
                      userId={user?.id}
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
      </header>
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        type={authDialogType}
      />
    </>
  );
}
