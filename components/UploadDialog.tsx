import { UploadFilled } from "@/components/icons";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UploadSchedule from "./UploadSchedule";
import type { Tables } from "@/types/supabase";

interface UploadDialogProps {
  term: Tables<"terms">;
}

export function UploadDialog({ term }: UploadDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hidden md:flex">
          <UploadFilled className="size-4" />
          <span className="hidden md:block">Upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center gap-8">
        <div className="space-y-2 text-center max-w-md">
          <h1 className="heading-3">Upload your schedule</h1>
          <p className="text-muted-foreground">
            Take a screenshot of your schedule from your UCalgary portal and
            upload the image here.
          </p>
        </div>
        <div className="w-full min-w-[28rem] space-y-4">
          <UploadSchedule term={term} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
