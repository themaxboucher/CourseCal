"use server";

import type { Tables, TablesUpdate } from "@/types/supabase";
import { createAdminClient, createClient } from "../supabase/server";

export async function getLoggedInUser(): Promise<Tables<"users"> | false> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  // A session can outlive its profile row if account deletion fails partway,
  // so treat a missing profile as logged out rather than throwing on every
  // page load.
  return data ?? false;
}

export async function updateUser(
  userId: string,
  user: Partial<TablesUpdate<"users">>,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update(user)
    .eq("id", userId);
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
}

export async function markUserWelcomed(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update({ has_been_welcomed: true })
    .eq("id", userId);
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
}

export async function markUserCompletedOnboarding(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update({ has_completed_onboarding: true })
    .eq("id", userId);
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
}

export async function deleteAccount() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  const admin = createAdminClient();

  // Storage has no foreign key to `users`, so avatars are not cleaned up by
  // the cascade and have to be removed explicitly.
  const { data: avatarFiles, error: listError } = await admin.storage
    .from("avatars")
    .list(user.id);
  if (listError) {
    console.error(listError);
  } else if (avatarFiles.length > 0) {
    const { error: removeError } = await admin.storage
      .from("avatars")
      .remove(avatarFiles.map((file) => `${user.id}/${file.name}`));
    // An orphaned avatar file is not worth failing the deletion over.
    if (removeError) {
      console.error(removeError);
    }
  }

  // Deleting the profile row cascades to `events` and `course_colors`.
  const { error: profileError } = await admin
    .from("users")
    .delete()
    .eq("id", user.id);
  if (profileError) {
    console.error(profileError);
    throw new Error(profileError.message);
  }

  // `public.users` has no foreign key to `auth.users`, so the auth record
  // survives the delete above and must be removed separately. Without this the
  // email could still request a magic link and sign back in.
  const { error: authError } = await admin.auth.admin.deleteUser(user.id);
  if (authError) {
    console.error(authError);
    throw new Error(authError.message);
  }

  // Deleting the auth user drops its sessions server-side, so a local sign-out
  // is enough to clear the cookies and avoids a doomed revoke request.
  await supabase.auth.signOut({ scope: "local" });
}
