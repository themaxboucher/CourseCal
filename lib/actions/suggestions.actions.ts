"use server";

import { createClient } from "../supabase/server";
import { getFriendIds } from "./friends.actions";
import {
  PROFILE_COLUMNS,
  type Profile,
  type SuggestedFriend,
} from "../utils/profiles";

/**
 * Ranked people worth following, for the term being viewed.
 *
 * Backed by the `suggested_friends` SECURITY DEFINER function, which reads
 * `events` and `friendships` rows the caller is not permitted to see and
 * returns only profile columns and two counts — never an event row, a time, or
 * a location.
 *
 * Failures return an empty list rather than throwing: suggestions are a nicety
 * and must never be the reason somebody cannot finish onboarding.
 */
export async function getSuggestedFriends(
  termId: number,
  limit = 12,
): Promise<SuggestedFriend[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("suggested_friends", {
    p_term: termId,
    p_limit: limit,
  });

  if (error) {
    console.error(error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    username: row.username,
    // The generated types can't express nullability of a RETURNS TABLE column,
    // but `name`, `major` and `avatar` are all nullable on `users`.
    name: row.name ?? null,
    major: row.major ?? null,
    avatar: row.avatar ?? null,
    sharedCourses: row.shared_courses ?? 0,
    mutualFriends: row.mutual_friends ?? 0,
  }));
}

/**
 * A handful of recent accounts, for when neither signal produced anything.
 *
 * The first person on campus has no classmates and no mutuals; showing them an
 * empty step teaches them the feature is dead. Existing friends are left out —
 * everybody else is fair game, newest first, so the people still onboarding
 * alongside them are the ones they see.
 *
 * Like `getSuggestedFriends`, failures degrade to an empty list.
 */
export async function getFallbackProfiles(limit = 6): Promise<Profile[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const friendIds = await getFriendIds();

  let request = supabase
    .from("users")
    .select(PROFILE_COLUMNS)
    .neq("id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (friendIds.length > 0) {
    request = request.not("id", "in", `(${friendIds.join(",")})`);
  }

  const { data, error } = await request;
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}
