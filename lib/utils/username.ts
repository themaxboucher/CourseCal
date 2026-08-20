import { z } from "zod";

// Mirrors the `users_username_check` constraint in the database. The database
// is the real gate; this exists only so the user gets a readable message
// before the round trip.
export const USERNAME_PATTERN = /^[a-z0-9_.]{3,30}$/;

// Trims and lowercases before validating, so typing "MaxB" saves `maxb`
// instead of being rejected for a rule the user can't see.
export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(
    z
      .string()
      .min(3, "Must be at least 3 characters")
      .max(30, "Must be 30 characters or fewer")
      .regex(
        USERNAME_PATTERN,
        "Use letters, numbers, dots and underscores only",
      ),
  );

/**
 * Usernames are stored lowercase — the CHECK constraint rejects anything else —
 * so normalize before saving or looking one up.
 */
export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}
