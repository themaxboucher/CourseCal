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
import { Tables } from "@/types/supabase";

interface WelcomeDialogProps {
  user: Tables<"users">;
  show: boolean;
}

export default function WelcomeDialog({ user, show }: WelcomeDialogProps) {
  const [open, setOpen] = useState<boolean>(!!show);

  const firstName = user.name?.split(" ")[0];

  useEffect(() => {
    setOpen(!!show);
  }, [show]);

  useEffect(() => {
    if (!show) return;
    (async () => {
      try {
        const { default: confetti } = await import("canvas-confetti");
        confetti({ particleCount: 140, spread: 70, origin: { y: 0.6 } });
        await markUserWelcomed(user.id);
      } catch {}
    })();
  }, [show, user.id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md flex flex-col items-center text-center"
      >
        <DialogHeader>
          <DialogTitle>Welcome, {firstName}!</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground mb-4 max-w-sm">
          Your schedule is saved. You can now log in from any device to view it.
        </p>
        <Button onClick={() => setOpen(false)} className="w-full">
          Let's go!
        </Button>
      </DialogContent>
    </Dialog>
  );
}
