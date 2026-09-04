import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { PostHogIdentify } from "@/components/PostHogIdentify";
import { getLoggedInUser } from "@/lib/actions/users.actions";

// Every onboarding step is behind auth and mid-flow; the pages below set only
// a title and inherit this.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Signup is the run of pages we most want attributed, and it is where the
  // name and major that become person properties are first set.
  const user = await getLoggedInUser();

  return (
    <main>
      {user && <PostHogIdentify user={user} />}
      <Navbar />
      <section className="flex flex-col gap-2 w-full max-w-[75rem] mx-auto px-4 md:px-8 py-16 md:py-18">
        {children}
      </section>
    </main>
  );
}
