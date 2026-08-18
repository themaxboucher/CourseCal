"use server";

import { isAllowedOtpType } from "../utils/otp";
import { createClient } from "../supabase/server";

export type AuthIntent = "login" | "signup";

export type SendMagicLinkResult =
  | { ok: true }
  | {
      ok: false;
      reason: "invalid_domain" | "no_account" | "rate_limited" | "unknown";
    };

// Supabase returns one of these when `shouldCreateUser` is false and no account
// exists for the address. Which one depends on the GoTrue version, so match both.
const NO_ACCOUNT_CODES = ["otp_disabled", "user_not_found"];
const RATE_LIMIT_CODES = [
  "over_email_send_rate_limit",
  "over_request_rate_limit",
];

export type VerifyMagicLinkResult = { ok: boolean };

export async function sendMagicLink(
  email: string,
  intent: AuthIntent,
): Promise<SendMagicLinkResult> {
  // Check if the email is a valid UCalgary email
  if (!email.toLowerCase().endsWith("@ucalgary.ca")) {
    return { ok: false, reason: "invalid_domain" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Only the signup path may create an account. Logging in with an unknown
      // address must fail so we can offer to sign the user up instead.
      shouldCreateUser: intent === "signup",
    },
  });

  if (error) {
    if (error.code && NO_ACCOUNT_CODES.includes(error.code)) {
      return { ok: false, reason: "no_account" };
    }
    if (
      error.status === 429 ||
      (error.code && RATE_LIMIT_CODES.includes(error.code))
    ) {
      return { ok: false, reason: "rate_limited" };
    }
    console.error(error);
    return { ok: false, reason: "unknown" };
  }

  return { ok: true };
}

/**
 * Redeems an emailed login link and establishes the session.
 *
 * Deliberately a server action rather than a `GET` route: a one-time token must
 * never be spendable by a bare request. Every user is on UCalgary's Microsoft
 * 365 tenant, whose link scanners fetch each URL in an incoming message, and a
 * token spent by a scanner is gone before the human ever clicks. Scanners crawl
 * links; they do not POST. The token also rides in the URL fragment, which
 * browsers never put on the wire, so a fetch of that URL carries nothing to
 * spend in the first place.
 */
export async function verifyMagicLink(
  tokenHash: string,
  type: string,
): Promise<VerifyMagicLinkResult> {
  if (!tokenHash || !isAllowedOtpType(type)) {
    return { ok: false };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });

  if (!error) {
    return { ok: true };
  }

  // A token is spent on first use, so a second pass over the same link — a
  // refresh, a back navigation — fails even though the session it created is
  // perfectly good. Only report failure when there is no session to fall back
  // on.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    return { ok: true };
  }

  console.error(error);
  return { ok: false };
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return true;
}
