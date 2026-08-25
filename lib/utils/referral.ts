/** Name of the cookie holding the username of whoever shared the invite link. */
export const REFERRAL_COOKIE = "coursecal_ref";

/** Long enough to survive signing up, reading the magic-link email, and coming back. */
export const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const USERNAME_GRAMMAR = /^[a-z0-9_.]{3,30}$/;

/**
 * Referral values arrive from a query string, so clamp them to the same
 * grammar the `users_username_check` constraint enforces before they are
 * stored or looked up. Anything else is discarded rather than sanitised.
 */
export function sanitizeReferral(
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  const cleaned = value.trim().toLowerCase();
  return USERNAME_GRAMMAR.test(cleaned) ? cleaned : null;
}
