"use server";

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
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL!}/verify`,
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

export async function verifyMagicLink(code: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error(error);
    return false;
  }

  return data.user;
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
