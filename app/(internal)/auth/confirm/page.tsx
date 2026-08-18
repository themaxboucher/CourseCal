"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { verifyMagicLink } from "@/lib/actions/auth.actions";
import { isAllowedOtpType } from "@/lib/utils/otp";

// Long enough that an automated visit has usually been torn down before we
// spend the token, short enough that a real user only ever sees the spinner.
const AUTO_SUBMIT_DELAY_MS = 300;

/**
 * Redeems the emailed login link without asking the user to click anything.
 *
 * The token arrives in the URL fragment rather than the query string, so
 * fetching this page — which the mail provider's link scanner does to every URL
 * it sees — transmits no token: browsers and HTTP clients strip everything
 * after `#`. Only this script, running in the real browser that opened the
 * link, can read it, and it spends the token over a server action (a POST) that
 * a crawler will not issue.
 */
export default function ConfirmPage() {
  const router = useRouter();
  // Spending the token twice fails the second time, so hold off React Strict
  // Mode's double invocation of this effect.
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const params = new URLSearchParams(window.location.hash.slice(1));
    const tokenHash = params.get("token_hash");
    const type = params.get("type");

    // Drop the token from the address bar so a back navigation cannot replay a
    // link that has already been spent.
    window.history.replaceState(null, "", window.location.pathname);

    // `/verify` finishes the job: it reads the session this establishes, moves
    // any locally held schedule to the server, and routes onwards.
    const finish = (ok: boolean) =>
      router.replace(ok ? "/verify" : "/verify?error=invalid_link");

    if (!tokenHash || !isAllowedOtpType(type)) {
      finish(false);
      return;
    }

    const verify = async () => {
      const { ok } = await verifyMagicLink(tokenHash, type);
      finish(ok);
    };

    // Wait for a foreground tab. A scanner that renders the page at all does so
    // briefly and in the background, whereas a user who clicked the link is
    // looking right at it.
    window.setTimeout(() => {
      if (document.visibilityState === "visible") {
        verify();
        return;
      }

      document.addEventListener("visibilitychange", function onVisible() {
        if (document.visibilityState !== "visible") return;
        document.removeEventListener("visibilitychange", onVisible);
        verify();
      });
    }, AUTO_SUBMIT_DELAY_MS);
  }, [router]);

  return <Loading message="Signing you in..." />;
}
