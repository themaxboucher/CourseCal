import { Logo } from "../Logo";
import { ThemeSelector } from "../ThemeSelector";

export function Navbar() {
  return (
    <header className="flex justify-between items-center px-6 py-4">
      <Logo />
      <div>
        <ThemeSelector />
      </div>
    </header>
  );
}
