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
    <div className="flex flex-col items-center gap-8 w-full">
      <ProfileForm user={user} />
    </div>
  );
}
