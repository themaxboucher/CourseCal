import UploadForm from "@/components/onboarding/UploadForm";
import Image from "next/image";

export default function UploadPage() {
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

        <UploadForm />
      </div>
    </section>
  );
}
