import { type NextRequest, NextResponse } from "next/server";
import { unsubscribeFromFriendRequestEmails } from "@/lib/actions/notifications.actions";

/**
 * The `List-Unsubscribe` target, used by RFC 8058 one-click: the mail client
 * itself POSTs here when the recipient hits the unsubscribe control Gmail or
 * Outlook draws above the message. Nothing but a POST unsubscribes, which is
 * also what keeps UCalgary's link scanner from opting people out of mail they
 * never asked to stop — scanners crawl, they do not post.
 */
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return new NextResponse("Missing token", { status: 400 });
  }

  const ok = await unsubscribeFromFriendRequestEmails(token);
  return new NextResponse(ok ? "Unsubscribed" : "Invalid token", {
    status: ok ? 200 : 400,
  });
}

/**
 * A mail client with no one-click support sends a person here by GET instead.
 * A GET must not change anything, so it only hands the token to the page, which
 * asks for a real click.
 */
export function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  return NextResponse.redirect(
    new URL(
      `/unsubscribe#token=${encodeURIComponent(token)}`,
      request.nextUrl.origin,
    ),
  );
}
