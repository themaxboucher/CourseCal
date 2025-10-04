import { Bell, House, Search, Settings } from "lucide-react";
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
                  <Link href="/settings">
                    <Settings className="size-4.5" />
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
