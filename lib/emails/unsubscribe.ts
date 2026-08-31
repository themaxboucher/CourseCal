import { createHmac, timingSafeEqual } from "node:crypto";
import { requireEnv } from "@/lib/env";
import { emailOrigin } from "./origin";

/**
 * An unsubscribe link is followed from a mail client, where there is no session
 * and no cookie, so the recipient's identity has to travel in the link itself.
 * Signing it is what stops anyone from unsubscribing anyone else by editing a
 * uuid in a URL.
 */
const SEPARATOR = ".";

function sign(userId: string): string {
  return createHmac("sha256", requireEnv("EMAIL_UNSUBSCRIBE_SECRET"))
    .update(userId)
    .digest("base64url");
}

export function createUnsubscribeToken(userId: string): string {
  return `${userId}${SEPARATOR}${sign(userId)}`;
}

/** The user id a token vouches for, or `null` if it vouches for nothing. */
export function verifyUnsubscribeToken(token: string): string | null {
  const split = token.lastIndexOf(SEPARATOR);
  if (split <= 0) return null;

  const userId = token.slice(0, split);
  const provided = Buffer.from(token.slice(split + 1));
  const expected = Buffer.from(sign(userId));

  // `timingSafeEqual` throws on a length mismatch, and a length is not a secret.
  if (provided.length !== expected.length) return null;
  return timingSafeEqual(provided, expected) ? userId : null;
}

/**
 * The link printed in the message body.
 *
 * The token rides in the fragment for the same reason the login token does:
 * UCalgary's Microsoft 365 tenant fetches every URL in an incoming message, and
 * everything after `#` is stripped before the request leaves the browser. A
 * scanner that follows this link arrives with nothing to act on, and the page
 * waits for a real click regardless.
 */
export function unsubscribeUrl(token: string): string {
  return `${emailOrigin()}/unsubscribe#token=${encodeURIComponent(token)}`;
}

/**
 * The `List-Unsubscribe` target, which is a different problem: RFC 8058
 * one-click has the mail client itself POST here, so the token has to be in the
 * query string where a POST body-less request can carry it. Only `POST`
 * unsubscribes; `GET` redirects a human to the page above.
 */
export function unsubscribeEndpoint(token: string): string {
  return `${emailOrigin()}/api/unsubscribe?token=${encodeURIComponent(token)}`;
}
