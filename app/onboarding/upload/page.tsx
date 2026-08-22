import { getLoggedInUser } from "@/lib/actions/users.actions";
import { redirect } from "next/navigation";
import UploadSchedule from "@/components/UploadSchedule";

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  const user = await getLoggedInUser();
  if (!user) {
    redirect("/");
  }

  return (
    <section className="flex flex-col gap-2 max-w-[75rem] mx-auto px-8 py-16">
      <div className="flex flex-col items-center gap-8">
        <div className="space-y-2 text-center max-w-md">
          <h1 className="heading-3">Upload your schedule</h1>
          <p className="text-muted-foreground">
            Take a screenshot of your schedule from your UCalgary portal and
            upload the image here.
          </p>
        </div>
        <div className="w-full max-w-[30rem] space-y-4">
          <UploadSchedule />
        </div>
      </div>
    </section>
  );
}
