import UploadForm from "@/components/onboarding/UploadForm";

export default function UploadPage() {
  return (
    <section className="flex flex-col gap-2 max-w-[75rem] mx-auto px-8 py-16">
      <div className="flex flex-col items-center gap-8">
        <h1 className="heading-3">Upload your UCalgary schedule</h1>
        <UploadForm />
      </div>
    </section>
  );
}
