"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarCheck2 } from "lucide-react";

interface UploadSuccessDialogProps {
  show: boolean;
}

export default function UploadSuccessDialog({
  show,
}: UploadSuccessDialogProps) {
  const [open, setOpen] = useState<boolean>(!!show);
  const router = useRouter();

  useEffect(() => {
    setOpen(!!show);
  }, [show]);

  useEffect(() => {
    if (!show) return;
    (async () => {
      try {
        const { default: confetti } = await import("canvas-confetti");
        confetti({ particleCount: 140, spread: 70, origin: { y: 0.6 } });
      } catch {}
    })();
  }, [show]);

  const handleClose = () => {
    setOpen(false);
    // Remove the query param from the URL
    router.replace("/schedule", { scroll: false });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md flex flex-col items-center text-center"
      >
        <DialogHeader className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center rounded-full bg-red-500 border-2 border-red-300 dark:border-red-800 text-white p-3.5">
            <CalendarCheck2 className="size-6" />
          </div>
          <DialogTitle>Schedule imported successfully!</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground mb-4 max-w-sm">
          Your schedule has been analyzed and imported. Double-check that
          everything looks correct and make any adjustments if needed.
        </p>
        <Button onClick={handleClose}>View my schedule</Button>
      </DialogContent>
    </Dialog>
  );
}
