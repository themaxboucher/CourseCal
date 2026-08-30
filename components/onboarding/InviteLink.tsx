"use client";

import { useState } from "react";
import { CheckFilled, UploadFilled } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function InviteLink({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);
  // Built in the browser so it is correct on localhost, previews and prod
  // without threading a base URL through the server.
  const [url] = useState(() =>
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/?ref=${username}`,
  );

  const canShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function share() {
    const message = {
      title: "CourseCal",
      text: "Add me on CourseCal and we can see when we're both free.",
      url,
    };
    try {
      if (canShare) {
        await navigator.share(message);
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // A cancelled share sheet rejects too, so this is not necessarily a
      // failure worth telling the user about.
      console.error(error);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Invite a friend</p>
      <div className="flex items-center gap-2">
        <Input
          readOnly
          value={url}
          aria-label="Your invite link"
          onFocus={(event) => event.currentTarget.select()}
          className="text-muted-foreground"
        />
        <Button type="button" onClick={share}>
          {copied ? (
            <CheckFilled className="size-4" />
          ) : (
            <UploadFilled className="size-4" />
          )}
          {copied ? "Copied" : canShare ? "Share" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
