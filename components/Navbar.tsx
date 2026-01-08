import { Settings } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import Link from "next/link";
import { ThemeSlider } from "./ThemeSlider";

interface NavbarProps {
  loggedIn?: boolean;
}

export function Navbar({ loggedIn = false }: NavbarProps) {
  return (
    <header className="flex justify-between items-center px-4 md:px-6 py-4 relative z-50">
      <Logo />
      <div>
        <div>
          <ul className="flex items-center">
            <li>
              <ThemeSlider />
            </li>
            {loggedIn && (
              <li>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/settings">
                    <Settings className="size-4.5" />
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
