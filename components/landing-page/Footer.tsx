import { Logo } from "../Logo";

export function Footer() {
  return (
    <footer className="flex flex-col gap-2 max-w-[75rem] mx-auto px-8">
      <div className="w-full py-6 space-y-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 border-t border-border">
        <Logo />
        <div className="text-xs text-muted-foreground">
          © 2025 Maxime Boucher. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
