import { Navbar } from "@/components/Navbar";
import { getAuthUser } from "@/lib/actions/users.actions";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  if (!user) {
    redirect("/");
  }

  return (
    <main>
      <Navbar />
      <section className="flex flex-col items-center gap-2 max-w-[75rem] mx-auto px-8 py-16">
        {children}
      </section>
    </main>
  );
}
