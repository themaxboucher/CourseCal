"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CloseCircleFilled } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { setFriendRequestEmails } from "@/lib/actions/notifications.actions";

export default function EmailNotifications({
  friendRequests,
}: {
  friendRequests: boolean;
}) {
  const [enabled, setEnabled] = useState(friendRequests);
  const [busy, setBusy] = useState(false);

  async function toggle(next: boolean) {
    // Flip first: the switch should follow the thumb, not the round trip. A
    // failure puts it back.
    setEnabled(next);
    setBusy(true);
    const ok = await setFriendRequestEmails(next);
    setBusy(false);
    if (!ok) {
      setEnabled(!next);
      toast("Couldn't save that. Try again.", {
        icon: <CloseCircleFilled className="text-destructive size-5" />,
      });
    }
  }

  return (
    <div className="flex items-start justify-between gap-6">
      <div className="space-y-1">
        <Label htmlFor="friend-request-emails">Friend requests</Label>
        <p className="text-sm text-muted-foreground">
          Get an email when someone adds you on CourseCal.
        </p>
      </div>
      <Switch
        id="friend-request-emails"
        checked={enabled}
        disabled={busy}
        onCheckedChange={toggle}
      />
    </div>
  );
}
