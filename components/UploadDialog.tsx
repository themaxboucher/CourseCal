import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UploadForm from "./onboarding/UploadForm";
import Image from "next/image";

interface UploadDialogProps {
  terms: Term[];
  user: User;
}

export function UploadDialog({ terms, user }: UploadDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hidden md:flex">
          <Upload className="size-4" />
          <span className="hidden md:block">Upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center gap-8">
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
      </DialogContent>
    </Dialog>
  );
}
