import { Logo } from "../Logo";

export function Footer() {
  return (
    <footer className="flex flex-col items-center gap-2 max-w-[75rem] mx-auto md:px-8 px-4">
      <div className="py-6 w-full space-y-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 border-t-2">
        <div className="flex flex-col gap-2 mb-0">
          <Logo className="mb-0" />
          <div className="text-xs font-medium text-muted-foreground mb-0">
            Made by{" "}
            <a
              href="https://maxboucher.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-500 hover:underline"
            >
              Max Boucher
            </a>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          © 2026 Maxime Boucher. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
