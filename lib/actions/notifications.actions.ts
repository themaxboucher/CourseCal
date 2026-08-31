"use server";

import { revalidatePath } from "next/cache";
import { verifyUnsubscribeToken } from "../emails/unsubscribe";
import { createAdminClient, createClient } from "../supabase/server";

/** Toggled from settings, by someone who is signed in as themselves. */
export async function setFriendRequestEmails(
  enabled: boolean,
): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("users")
    .update({ email_friend_requests: enabled })
    .eq("id", user.id);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
}

/**
 * Turns the emails off for whoever a signed token names.
 *
 * There is no session here — the caller arrived from a mail client — so the
 * signature is the whole of the authorization, and the write has to go through
 * the admin client because no policy covers a stranger updating a row. A token
 * that does not verify changes nothing.
 */
export async function unsubscribeFromFriendRequestEmails(
  token: string,
): Promise<boolean> {
  const userId = verifyUnsubscribeToken(token);
  if (!userId) return false;

  const admin = createAdminClient();
  const { error } = await admin
    .from("users")
    .update({ email_friend_requests: false })
    .eq("id", userId);

  if (error) {
    console.error(error);
    return false;
  }

  // The settings toggle reads this column server-side, so a session that is
  // already open elsewhere should not keep showing it switched on.
  revalidatePath("/settings");
  return true;
}
