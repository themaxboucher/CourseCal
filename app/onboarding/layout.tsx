import { Navbar } from "@/components/Navbar";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navbar />
      <section className="flex flex-col items-center gap-2 max-w-[75rem] mx-auto px-8 py-16">
        {children}
      </section>
    </main>
  );
}
