import { Navbar } from "@/components/Navbar";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navbar isLoggedIn={true} />
      <section className="flex flex-col items-center gap-2 w-full max-w-[75rem] mx-auto px-4 md:px-8 py-16 md:py-18">
        {children}
      </section>
    </main>
  );
}
