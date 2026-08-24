import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";

// Every onboarding step is behind auth and mid-flow; the pages below set only
// a title and inherit this.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navbar />
      <section className="flex flex-col gap-2 w-full max-w-[75rem] mx-auto px-4 md:px-8 py-16 md:py-18">
        {children}
      </section>
    </main>
  );
}
