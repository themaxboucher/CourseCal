import type { NextRequest } from "next/server";
import { renderOgCard } from "@/lib/og/card";
import { INVITE_DESCRIPTION } from "@/lib/site";
import { sanitizeReferral } from "@/lib/utils/referral";

// The card reads its fonts and mascot off disk, which the edge runtime cannot do.
export const runtime = "nodejs";

/**
 * The card behind a shared invite link.
 *
 * It lives in a route handler rather than a `opengraph-image` file because the
 * referral rides in the query string (`/join?ref=…`) and the file convention is
 * only handed route params.
 *
 * The username is taken from the URL and never looked up. Two reasons: `users`
 * is readable by `authenticated` only, so an unauthenticated crawler could not
 * resolve a name anyway, and echoing back a value the recipient already has in
 * the link they were sent reveals nothing new — whereas printing the display
 * name behind it would turn guessable usernames into a name-and-photo scraper.
 * `sanitizeReferral` is also what keeps arbitrary text out of the image.
 */
export async function GET(request: NextRequest) {
  const referral = sanitizeReferral(request.nextUrl.searchParams.get("ref"));

  return renderOgCard({
    eyebrow: "Invite from a friend",
    headline: referral
      ? `@${referral} wants to compare schedules.`
      : "Compare schedules with your friends.",
    body: INVITE_DESCRIPTION,
  });
}
