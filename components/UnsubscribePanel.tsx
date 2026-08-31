"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircleFilled,
  InboxFilled,
  Loading3Filled,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { unsubscribeFromFriendRequestEmails } from "@/lib/actions/notifications.actions";

type Stage = "reading" | "ready" | "working" | "done" | "invalid";

/**
 * Confirms an unsubscribe from a link in an email.
 *
 * The token arrives in the URL fragment, for the reason the login token does:
 * every UCalgary address is on a Microsoft 365 tenant that fetches each link in
 * an incoming message, and nothing after `#` survives the trip to a server. On
 * top of that this page never acts on its own — someone has to press the
 * button — so even a scanner that runs the script changes nothing.
 */
export default function UnsubscribePanel() {
  const [stage, setStage] = useState<Stage>("reading");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const value = params.get("token");

    // Nothing here needs to survive a refresh, and a token left in the address
    // bar is a token in someone's browser history.
    window.history.replaceState(null, "", window.location.pathname);

    if (!value) {
      setStage("invalid");
      return;
    }
    setToken(value);
    setStage("ready");
  }, []);

  async function confirm() {
    if (!token) return;
    setStage("working");
    const ok = await unsubscribeFromFriendRequestEmails(token);
    setStage(ok ? "done" : "invalid");
  }

  return (
    <section className="min-h-[calc(100dvh-68px)] flex flex-col gap-2 max-w-80 mx-auto px-4 md:px-8 py-16">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 sm:gap-6 mb-20">
        <div className="flex items-center justify-center rounded-full bg-red-500 border-2 border-red-300 dark:border-red-800 text-white p-3.5">
          {stage === "done" ? (
            <CheckCircleFilled className="size-6" />
          ) : (
            <InboxFilled className="size-6" />
          )}
        </div>

        {stage === "done" ? (
          <div className="flex flex-col items-center gap-2">
            <h1 className="heading-3 text-center">You're unsubscribed</h1>
            <p className="text-sm text-muted-foreground text-center text-pretty">
              We won't email you about friend requests any more. They'll still
              be waiting for you in CourseCal.
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/friends">Go to CourseCal</Link>
            </Button>
          </div>
        ) : stage === "invalid" ? (
          <div className="flex flex-col items-center gap-2">
            <h1 className="heading-3 text-center">This link didn't work</h1>
            <p className="text-sm text-muted-foreground text-center text-pretty">
              It may have been cut short by your email client. You can turn
              these emails off in your settings instead.
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/settings">Open settings</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <h1 className="heading-3 text-center">
              Turn off friend request emails?
            </h1>
            <p className="text-sm text-muted-foreground text-center text-pretty">
              You'll stop getting an email when someone adds you. Login links
              are unaffected.
            </p>
            <Button
              className="mt-4"
              onClick={confirm}
              disabled={stage !== "ready"}
            >
              {stage === "working" && (
                <Loading3Filled className="size-4 animate-spin" />
              )}
              {stage === "working" ? "Turning off..." : "Turn them off"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
