"use server";

import { createClient } from "../supabase/server";
import { normalizeUsername } from "../utils/username";
import {
  DIRECTORY_PAGE_SIZE,
  PROFILE_COLUMNS,
  type Profile,
  type ProfilePage,
  sanitizeSearchTerm,
} from "../utils/profiles";

async function currentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/**
 * The full directory, newest accounts first. Paginated because the page size is
 * the only thing bounding how much of the roster a single request can pull.
 */
export async function browseProfiles(page = 0): Promise<ProfilePage> {
  const supabase = await createClient();
  const viewerId = await currentUserId();

  const from = page * DIRECTORY_PAGE_SIZE;
  // PostgREST ranges are inclusive, so this asks for one row beyond the page.
  // Its presence is what tells us another page exists, without a count query.
  const to = from + DIRECTORY_PAGE_SIZE;

  let request = supabase
    .from("users")
    .select(PROFILE_COLUMNS)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (viewerId) {
    request = request.neq("id", viewerId);
  }

  const { data, error } = await request;
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return {
    profiles: data.slice(0, DIRECTORY_PAGE_SIZE),
    hasMore: data.length > DIRECTORY_PAGE_SIZE,
  };
}

/** Matches on username or display name. A query under 2 characters matches nothing. */
export async function searchProfiles(
  rawQuery: string,
  page = 0,
): Promise<ProfilePage> {
  const query = sanitizeSearchTerm(rawQuery);
  if (query.length < 2) {
    return { profiles: [], hasMore: false };
  }

  const supabase = await createClient();
  const viewerId = await currentUserId();

  const from = page * DIRECTORY_PAGE_SIZE;
  const to = from + DIRECTORY_PAGE_SIZE;

  let request = supabase
    .from("users")
    .select(PROFILE_COLUMNS)
    .or(`username.ilike.%${query}%,name.ilike.%${query}%`)
    .order("username", { ascending: true })
    .range(from, to);

  if (viewerId) {
    request = request.neq("id", viewerId);
  }

  const { data, error } = await request;
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return {
    profiles: data.slice(0, DIRECTORY_PAGE_SIZE),
    hasMore: data.length > DIRECTORY_PAGE_SIZE,
  };
}

export async function getProfileByUsername(
  username: string,
): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select(PROFILE_COLUMNS)
    .eq("username", normalizeUsername(username))
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
}
