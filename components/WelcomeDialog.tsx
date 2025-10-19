"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { markUserWelcomed } from "@/lib/actions/users.actions";

interface WelcomeDialogProps {
  userId: string;
  show: boolean;
}

export default function WelcomeDialog({ userId, show }: WelcomeDialogProps) {
  const [open, setOpen] = useState<boolean>(!!show);

  useEffect(() => {
    setOpen(!!show);
  }, [show]);

  useEffect(() => {
    if (!show) return;
    (async () => {
      try {
        const { default: confetti } = await import("canvas-confetti");
        confetti({ particleCount: 140, spread: 70, origin: { y: 0.6 } });
        await markUserWelcomed(userId);
      } catch {}
    })();
  }, [show, userId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md flex flex-col items-center text-center"
      >
        <DialogHeader>
          <DialogTitle>Welcome to CourseCal!</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-4">
          Your courses are now imported and ready to use. Unfortunately, the ICS
          file you downloaded from UCalgary is not always fully accurate. Check
          if any of your courses are missing and add them manually.
        </p>
        <Button onClick={() => setOpen(false)} className="w-full">
          Let's go!
        </Button>
      </DialogContent>
    </Dialog>
  );
}
