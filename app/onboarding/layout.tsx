import { Navbar } from "@/components/Navbar";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navbar isLoggedIn={true} />
      <section className="flex w-full flex-col items-center gap-2 max-w-[75rem] mx-auto px-4 md:px-8 py-12 md:py-16">
        {children}
      </section>
    </main>
  );
}
