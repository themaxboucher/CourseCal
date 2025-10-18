import UploadForm from "@/components/onboarding/UploadForm";
import { getTerms } from "@/lib/actions/terms.actions";
import { getLoggedInUser } from "@/lib/actions/users.actions";
import Image from "next/image";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  const user = await getLoggedInUser();
  if (!user) {
    redirect("/");
  }
  const terms = await getTerms();

  return (
    <section className="flex flex-col gap-2 max-w-[75rem] mx-auto px-8 py-16">
      <div className="flex flex-col items-center gap-8">
        <div className="space-y-2 text-center max-w-md">
          <h1 className="heading-3">Upload your UCalgary schedule</h1>
          <p className="text-muted-foreground">
            In your UCalgary portal 'Home', click{" "}
            <span className="font-medium">'Download Calendar'</span> under
            'Enrolled Courses'. Upload the .ics file here.
          </p>
        </div>
        <Image
          src="/download-calendar-screenshot.png"
          alt="UCalgary portal 'Download Calendar' screenshot"
          width={334}
          height={166}
          className="shadow-lg rounded-xl border-2"
        />

        <UploadForm terms={terms} user={user} />
      </div>
    </section>
  );
}
