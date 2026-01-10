import { CalendarFold, Settings } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import Link from "next/link";
import { ThemeSlider } from "./ThemeSlider";

interface NavbarProps {
  showSettings?: boolean;
  hasSchedule?: boolean;
}

export function Navbar({
  showSettings = false,
  hasSchedule = false,
}: NavbarProps) {
  return (
    <header className="flex justify-between items-center px-4 md:px-6 py-4 relative z-50">
      <Logo />
      <div>
        <div>
          <ul className="flex items-center">
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
  );
}
