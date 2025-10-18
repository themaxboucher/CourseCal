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
    <section className="flex flex-col gap-2 max-w-[75rem] mx-auto px-8 py-16">
      <div className="flex flex-col items-center gap-8">
        <h1 className="heading-3">Let's add some details!</h1>
        <ProfileForm user={user} />
      </div>
    </section>
  );
}
