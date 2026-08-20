import type { Tables } from "@/types/supabase";

export type Profile = Pick<
  Tables<"users">,
  "id" | "username" | "name" | "major" | "avatar"
>;

// `users` is readable by every signed-in account, so profile reads name their
// columns explicitly instead of selecting `*`. Email and the onboarding flags
// are never part of a profile payload, even by accident.
export const PROFILE_COLUMNS = "id, username, name, major, avatar";

export const DIRECTORY_PAGE_SIZE = 24;

export interface ProfilePage {
  profiles: Profile[];
  hasMore: boolean;
}

/** How the signed-in viewer relates to another account. */
export type RelationshipStatus =
  | "self"
  | "none"
  | "outgoing_pending"
  | "incoming_pending"
  | "friends";

export interface FriendRequest {
  friendshipId: number;
  createdAt: string;
  profile: Profile;
}

export type FriendActionResult =
  | { ok: true }
  | {
      ok: false;
      reason:
        | "not_authenticated"
        | "already_connected"
        | "self"
        | "not_found"
        | "unknown";
    };

export const FRIEND_ACTION_MESSAGES: Record<
  Extract<FriendActionResult, { ok: false }>["reason"],
  string
> = {
  not_authenticated: "You need to be signed in to do that",
  already_connected: "You're already connected with this person",
  self: "You can't add yourself",
  not_found: "That request is no longer available",
  unknown: "Something went wrong. Try again.",
};

/**
 * `,` `(` `)` `%` `*` and `\` are all operators inside a PostgREST filter
 * string. Left in place they would corrupt the `or(...)` expression rather than
 * match anything, so they are stripped before interpolation.
 */
export function sanitizeSearchTerm(query: string): string {
  return query.replace(/[,()%\\*]/g, " ").trim();
}

/** Picks whichever side of a friendship row is not the viewer. */
export function otherParty<T>(
  viewerId: string,
  requesterId: string,
  requesterValue: T,
  addresseeValue: T,
): T {
  return requesterId === viewerId ? addresseeValue : requesterValue;
}
