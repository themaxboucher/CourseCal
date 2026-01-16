"use client";

import { useState } from "react";
import { CalendarFold, Settings } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import Link from "next/link";
import { ThemeSlider } from "./ThemeSlider";
import { AuthDialog } from "./auth/AuthDialog";

interface NavbarProps {
  showSettings?: boolean;
  hasSchedule?: boolean;
}

export function Navbar({
  showSettings = false,
  hasSchedule = false,
}: NavbarProps) {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogType, setAuthDialogType] = useState<"signup" | "login">("login");
  function handleAuthDialogOpen(type: "signup" | "login") {
    setAuthDialogOpen(true);
    setAuthDialogType(type);
  }
  function handleAuthDialogClose() {
    setAuthDialogOpen(false);
    setAuthDialogType("login");
  }
  return (
    <>
      <header className="flex justify-between items-center px-4 md:px-6 py-4 relative z-50">
        <Logo />
        <div>
          <div>
            <ul className="flex items-center gap-2">
              <li>
                <Button size="sm" variant="ghost" onClick={() => handleAuthDialogOpen("login")}>
                  Log in
                </Button>
              </li>
              <li>
                <Button size="sm" onClick={() => handleAuthDialogOpen("signup")}>Join</Button>
              </li>
            <li>
              <ThemeSlider />
            </li>
            {showSettings && (
              <li>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/settings">
                    <Settings className="size-4.5" />
                  </Link>
                </Button>
              </li>
            )}
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
          </ul>
        </div>
      </div>
    </header>
    <AuthDialog open={authDialogOpen} onOpenChange={handleAuthDialogClose} type={authDialogType} />
    </>
  );
}
