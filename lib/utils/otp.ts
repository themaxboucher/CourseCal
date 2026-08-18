// `signInWithOtp` mails a `magiclink` token to an existing account and a
// `signup` token to one it has just created, so both arrive at `/auth/confirm`.
export const ALLOWED_OTP_TYPES = ["magiclink", "signup", "email"] as const;

export type AllowedOtpType = (typeof ALLOWED_OTP_TYPES)[number];

// Shared by the confirm page and the action it calls: the page reads the type
// out of a URL, so the server has to re-check whatever it is handed.
export function isAllowedOtpType(
  value: string | null,
): value is AllowedOtpType {
  return value !== null && ALLOWED_OTP_TYPES.includes(value as AllowedOtpType);
}
