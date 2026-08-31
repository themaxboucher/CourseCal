import { createAdminClient } from "@/lib/supabase/server";
import { friendRequestEmailRatelimit } from "@/lib/ratelimit";
import { NOTIFICATION_FROM, resend } from "./client";
import {
  createUnsubscribeToken,
  unsubscribeEndpoint,
  unsubscribeUrl,
} from "./unsubscribe";
import {
  friendRequestHtml,
  friendRequestSubject,
  friendRequestText,
} from "./templates/friend-request";

/** Discriminates rows in `email_notifications`. */
const NOTIFICATION_TYPE = "friend_request";

interface SendFriendRequestEmailArgs {
  friendshipId: number;
  requesterId: string;
  addresseeId: string;
}

/**
 * Emails the addressee that a friend request is waiting for them.
 *
 * Called from `after()`, so nothing here is on the path of the click that
 * caused it and nothing here can fail it — by the time this runs the row is
 * already committed and the sender has already been told it worked. Every exit
 * is a quiet one: the request stands whether or not the mail goes out.
 *
 * The reads use the admin client because both halves are out of reach of the
 * requester's session by design. `PROFILE_COLUMNS` deliberately excludes the
 * email address, and `email_notifications` has no policy at all.
 */
export async function sendFriendRequestEmail({
  friendshipId,
  requesterId,
  addresseeId,
}: SendFriendRequestEmailArgs): Promise<void> {
  const admin = createAdminClient();

  const { data: people, error: peopleError } = await admin
    .from("users")
    .select("id, username, name, avatar, email, email_friend_requests")
    .in("id", [requesterId, addresseeId]);

  if (peopleError) {
    console.error(peopleError);
    return;
  }

  const requester = people.find((person) => person.id === requesterId);
  const addressee = people.find((person) => person.id === addresseeId);
  if (!requester || !addressee) return;

  // The opt-out. Checked before anything is written, so turning these off
  // leaves no trace of the ones that were never sent.
  if (!addressee.email_friend_requests) return;

  // Claim the ledger row first. The unique index on
  // (recipient, type, friendship_id) is what makes a second delivery
  // impossible — a double submit or a concurrent instance loses the race here
  // rather than in Resend's queue.
  const { data: ledger, error: ledgerError } = await admin
    .from("email_notifications")
    .insert({
      recipient: addresseeId,
      type: NOTIFICATION_TYPE,
      friendship_id: friendshipId,
    })
    .select("id")
    .single();

  if (ledgerError) {
    // 23505 is `email_notifications_dedupe_key` — already sent, nothing to do.
    if (ledgerError.code !== "23505") console.error(ledgerError);
    return;
  }

  // Give the row back if the message does not actually go out, so the ledger
  // only ever holds mail that was really sent.
  const release = async () => {
    const { error } = await admin
      .from("email_notifications")
      .delete()
      .eq("id", ledger.id);
    if (error) console.error(error);
  };

  const { success: withinLimit } =
    await friendRequestEmailRatelimit.limit(addresseeId);
  if (!withinLimit) {
    await release();
    return;
  }

  const token = createUnsubscribeToken(addresseeId);
  const props = {
    senderName: requester.name ?? requester.username,
    senderUsername: requester.username,
    senderAvatar: requester.avatar,
    unsubscribeUrl: unsubscribeUrl(token),
  };

  try {
    const { data, error } = await resend().emails.send(
      {
        from: NOTIFICATION_FROM,
        to: [addressee.email],
        subject: friendRequestSubject(props),
        html: friendRequestHtml(props),
        text: friendRequestText(props),
        headers: {
          // One-click unsubscribe, per RFC 8058. Gmail and Microsoft both weigh
          // its presence on mail they consider bulk, and every recipient here
          // sits behind the same Microsoft tenant.
          "List-Unsubscribe": `<${unsubscribeEndpoint(token)}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      },
      // Belt and braces alongside the ledger: covers a retry that happens
      // inside Resend rather than here.
      { idempotencyKey: `${NOTIFICATION_TYPE}-${friendshipId}` },
    );

    if (error || !data) {
      console.error(error);
      await release();
      return;
    }

    const { error: stampError } = await admin
      .from("email_notifications")
      .update({ provider_id: data.id })
      .eq("id", ledger.id);
    if (stampError) console.error(stampError);
  } catch (error) {
    console.error(error);
    await release();
  }
}
