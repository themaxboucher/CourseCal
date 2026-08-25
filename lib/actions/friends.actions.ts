"use server";

import { createClient } from "../supabase/server";
import {
  type FriendActionResult,
  type FriendRequest,
  PROFILE_COLUMNS,
  type Profile,
  type RelationshipStatus,
} from "../utils/profiles";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Ids reach these actions from the browser and are interpolated into PostgREST
 * filter strings, where `,` and `)` are operators. RLS would still confine any
 * damage to the caller's own rows, but a malformed id should be rejected
 * outright rather than reshaping the query.
 */
function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

async function requireUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// -- Reads ------------------------------------------------------------------

/**
 * Accepted friends, both directions. RLS already limits `friendships` to rows
 * the viewer is party to, so the only work here is picking whichever side of
 * each row is not the viewer.
 */
export async function getFriends(): Promise<Profile[]> {
  const supabase = await createClient();
  const viewerId = await requireUserId();
  if (!viewerId) return [];

  const { data, error } = await supabase
    .from("friendships")
    .select(
      `id, requester, addressee,
       requester_profile:users!friendships_requester_fkey(${PROFILE_COLUMNS}),
       addressee_profile:users!friendships_addressee_fkey(${PROFILE_COLUMNS})`,
    )
    .eq("status", "accepted");

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data
    .map((row) =>
      row.requester === viewerId
        ? row.addressee_profile
        : row.requester_profile,
    )
    .filter((profile): profile is Profile => profile !== null)
    .sort((a, b) => (a.name ?? a.username).localeCompare(b.name ?? b.username));
}

/**
 * Ids of the viewer's accepted friends, for queries that need to leave them
 * out. Cheaper than `getFriends` when only the ids matter.
 */
export async function getFriendIds(): Promise<string[]> {
  const supabase = await createClient();
  const viewerId = await requireUserId();
  if (!viewerId) return [];

  const { data, error } = await supabase
    .from("friendships")
    .select("requester, addressee")
    .eq("status", "accepted");

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data.map((row) =>
    row.requester === viewerId ? row.addressee : row.requester,
  );
}

/** Requests waiting on the viewer to accept or decline. */
export async function getIncomingRequests(): Promise<FriendRequest[]> {
  const supabase = await createClient();
  const viewerId = await requireUserId();
  if (!viewerId) return [];

  const { data, error } = await supabase
    .from("friendships")
    .select(
      `id, created_at, profile:users!friendships_requester_fkey(${PROFILE_COLUMNS})`,
    )
    .eq("addressee", viewerId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data.flatMap((row) =>
    row.profile
      ? [
          {
            friendshipId: row.id,
            createdAt: row.created_at,
            profile: row.profile,
          },
        ]
      : [],
  );
}

/** Requests the viewer has sent that haven't been answered yet. */
export async function getOutgoingRequests(): Promise<FriendRequest[]> {
  const supabase = await createClient();
  const viewerId = await requireUserId();
  if (!viewerId) return [];

  const { data, error } = await supabase
    .from("friendships")
    .select(
      `id, created_at, profile:users!friendships_addressee_fkey(${PROFILE_COLUMNS})`,
    )
    .eq("requester", viewerId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data.flatMap((row) =>
    row.profile
      ? [
          {
            friendshipId: row.id,
            createdAt: row.created_at,
            profile: row.profile,
          },
        ]
      : [],
  );
}

/** Drives the notification dot in the navbar. */
export async function getPendingRequestCount(): Promise<number> {
  const supabase = await createClient();
  const viewerId = await requireUserId();
  if (!viewerId) return 0;

  const { count, error } = await supabase
    .from("friendships")
    .select("id", { count: "exact", head: true })
    .eq("addressee", viewerId)
    .eq("status", "pending");

  if (error) {
    // A broken badge should never take down the page it sits on.
    console.error(error);
    return 0;
  }
  return count ?? 0;
}

export async function getRelationship(
  otherUserId: string,
): Promise<RelationshipStatus> {
  const viewerId = await requireUserId();
  if (!viewerId || !isUuid(otherUserId)) return "none";
  if (viewerId === otherUserId) return "self";

  const supabase = await createClient();
  // See `removeFriend` for why the pair is matched with two `in` filters.
  const pairIds = [viewerId, otherUserId];
  const { data, error } = await supabase
    .from("friendships")
    .select("requester, addressee, status")
    .in("requester", pairIds)
    .in("addressee", pairIds)
    .maybeSingle();

  if (error) {
    console.error(error);
    return "none";
  }
  if (!data) return "none";
  if (data.status === "accepted") return "friends";
  return data.requester === viewerId ? "outgoing_pending" : "incoming_pending";
}

/**
 * Every relationship the viewer has, keyed by the other person's id.
 *
 * The directory needs a status per row; asking per row would be one query per
 * profile on screen. RLS already narrows `friendships` to the viewer's own
 * rows, so the whole graph is one cheap read.
 */
export async function getRelationshipMap(): Promise<
  Record<string, RelationshipStatus>
> {
  const supabase = await createClient();
  const viewerId = await requireUserId();
  if (!viewerId) return {};

  const { data, error } = await supabase
    .from("friendships")
    .select("requester, addressee, status");

  if (error) {
    console.error(error);
    return {};
  }

  const map: Record<string, RelationshipStatus> = {};
  for (const row of data) {
    const viewerIsRequester = row.requester === viewerId;
    const otherId = viewerIsRequester ? row.addressee : row.requester;
    map[otherId] =
      row.status === "accepted"
        ? "friends"
        : viewerIsRequester
          ? "outgoing_pending"
          : "incoming_pending";
  }
  return map;
}

// -- Writes -----------------------------------------------------------------

export async function sendFriendRequest(
  addresseeId: string,
): Promise<FriendActionResult> {
  const viewerId = await requireUserId();
  if (!viewerId) return { ok: false, reason: "not_authenticated" };
  if (!isUuid(addresseeId)) return { ok: false, reason: "unknown" };
  if (viewerId === addresseeId) return { ok: false, reason: "self" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("friendships")
    .insert({ requester: viewerId, addressee: addresseeId, status: "pending" });

  if (error) {
    // 23505 is `friendships_pair_key` — a row for this pair already exists in
    // one direction or the other, so there is nothing to send.
    if (error.code === "23505") {
      return { ok: false, reason: "already_connected" };
    }
    // 23514 is `friendships_no_self`.
    if (error.code === "23514") {
      return { ok: false, reason: "self" };
    }
    console.error(error);
    return { ok: false, reason: "unknown" };
  }
  return { ok: true };
}

/**
 * Only the addressee of a pending request can accept it — enforced by the
 * `Addressee can accept` policy, not by these filters. An update that matches
 * no rows means the policy refused it.
 */
export async function acceptFriendRequest(
  requesterId: string,
): Promise<FriendActionResult> {
  const viewerId = await requireUserId();
  if (!viewerId) return { ok: false, reason: "not_authenticated" };
  if (!isUuid(requesterId)) return { ok: false, reason: "unknown" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("friendships")
    .update({ status: "accepted", responded_at: new Date().toISOString() })
    .eq("requester", requesterId)
    .eq("addressee", viewerId)
    .eq("status", "pending")
    .select("id");

  if (error) {
    console.error(error);
    return { ok: false, reason: "unknown" };
  }
  if (data.length === 0) return { ok: false, reason: "not_found" };
  return { ok: true };
}

/**
 * Declining deletes the row rather than marking it, which is what allows the
 * same person to send a new request later.
 */
export async function declineFriendRequest(
  requesterId: string,
): Promise<FriendActionResult> {
  const viewerId = await requireUserId();
  if (!viewerId) return { ok: false, reason: "not_authenticated" };
  if (!isUuid(requesterId)) return { ok: false, reason: "unknown" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("friendships")
    .delete()
    .eq("requester", requesterId)
    .eq("addressee", viewerId)
    .eq("status", "pending")
    .select("id");

  if (error) {
    console.error(error);
    return { ok: false, reason: "unknown" };
  }
  if (data.length === 0) return { ok: false, reason: "not_found" };
  return { ok: true };
}

/** Cancels an outgoing request or removes an accepted friend — same delete. */
export async function removeFriend(
  otherUserId: string,
): Promise<FriendActionResult> {
  const viewerId = await requireUserId();
  if (!viewerId) return { ok: false, reason: "not_authenticated" };
  if (!isUuid(otherUserId)) return { ok: false, reason: "unknown" };

  const supabase = await createClient();
  // Both columns must hold one of the two ids, and `friendships_no_self` rules
  // out a row holding the same id twice, so this matches the pair in whichever
  // direction it was created. An `or(and(...),and(...))` says that more
  // directly but cannot be used here: PostgREST rejects a logical operator on a
  // delete that also returns its rows, with `column friendships.requester does
  // not exist` (42703).
  const pairIds = [viewerId, otherUserId];
  const { data, error } = await supabase
    .from("friendships")
    .delete()
    .in("requester", pairIds)
    .in("addressee", pairIds)
    .select("id");

  if (error) {
    console.error(error);
    return { ok: false, reason: "unknown" };
  }
  if (data.length === 0) return { ok: false, reason: "not_found" };
  return { ok: true };
}
