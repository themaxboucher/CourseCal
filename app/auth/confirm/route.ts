import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// `signInWithOtp` mails a `magiclink` token to an existing account and a
// `signup` token to one it has just created, so both arrive at this route.
const ALLOWED_OTP_TYPES = ["magiclink", "signup", "email"] as const;
type AllowedOtpType = (typeof ALLOWED_OTP_TYPES)[number];

function isAllowedOtpType(value: string | null): value is AllowedOtpType {
  return value !== null && ALLOWED_OTP_TYPES.includes(value as AllowedOtpType);
}

/**
 * Verifies an emailed login link, then hands off to `/verify` to finish up.
 *
 * `verifyOtp` authenticates from the token hash alone. The PKCE exchange this
 * replaces needed a code verifier cookie held by the browser that requested the
 * link, which meant opening the email on a different device always failed.
 */
export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");

  // Only ever redirect to a fixed internal path — never to a value off the URL.
  const destination = request.nextUrl.clone();
  destination.pathname = "/verify";
  destination.search = "";

  if (!tokenHash || !isAllowedOtpType(type)) {
    destination.searchParams.set("error", "invalid_link");
    return NextResponse.redirect(destination);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });

  if (error) {
    console.error(error);
    destination.searchParams.set("error", "invalid_link");
  }

  return NextResponse.redirect(destination);
}
