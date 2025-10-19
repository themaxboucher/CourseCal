import { getLoggedInUser } from "@/lib/actions/users.actions";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getLoggedInUser();
  if (!user) {
    redirect("/");
  }

  // If the user has not completed onboarding, redirect to the onboarding page
  if (!user.hasCompletedOnboarding) {
    redirect("/onboarding/profile");
  }

  return <main>{children}</main>;
}
