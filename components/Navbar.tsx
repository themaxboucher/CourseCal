"use client";

import { useState } from "react";
import { CalendarFold } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import Link from "next/link";
import { AuthDialog } from "./auth/AuthDialog";
import UserAvatar from "./UserAvatar";
import { Tables } from "@/types/supabase";

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
      <header className="flex justify-between items-center px-4 md:px-6 py-4 relative z-50">
        <Logo />
        <div>
          <div>
            <ul className="flex items-center gap-2">
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
                    <Link href="/settings">
                      <UserAvatar avatarUrl={user?.avatar} name={user?.name} size="sm" />
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
