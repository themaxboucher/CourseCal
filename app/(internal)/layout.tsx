import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";

// Auth plumbing — check-email, verify, auth/confirm. `verify` and
// `auth/confirm` are Client Components and cannot export metadata of their
// own, so the noindex has to live here to cover them.
export const metadata: Metadata = {
  title: "Signing in",
  robots: { index: false, follow: false },
};

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
}
