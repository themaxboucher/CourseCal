import { Bell, CircleUserRound, House, Search } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import Link from "next/link";

interface NavbarProps {
  isApp?: boolean;
}

export function Navbar({ isApp = false }: NavbarProps) {
  return (
    <header className="flex justify-between items-center px-6 py-4">
      <Logo />
      <div>
        {isApp && (
          <div>
            <ul className="flex items-center">
              <li>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/schedule">
                    <House className="size-4.5" />
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/search">
                    <Search className="size-4.5" />
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/notifications">
                    <Bell className="size-4.5" />
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/settings">
                    <CircleUserRound className="size-4.5" />
                  </Link>
                </Button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
