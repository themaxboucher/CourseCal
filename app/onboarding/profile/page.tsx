import ProfileForm from "@/components/onboarding/ProfileForm";
import { getLoggedInUser } from "@/lib/actions/users.actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getLoggedInUser();
  if (!user) {
    redirect("/");
  }
  return (
    <div className="flex w-full flex-col items-center gap-8">
      <h1 className="heading-3">Let&apos;s add some details!</h1>
      <ProfileForm user={user} />
    </div>
  );
}
