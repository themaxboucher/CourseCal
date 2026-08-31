import { emailOrigin } from "../origin";

export interface FriendRequestEmailProps {
  /** Display name of the person who sent the request, falling back to their username. */
  senderName: string;
  senderUsername: string;
  senderAvatar: string | null;
  unsubscribeUrl: string;
}

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/**
 * Names, usernames and majors are typed by users and land in an HTML document
 * that is delivered to somebody else, so every interpolation is escaped. The
 * username pattern would survive on its own; the display name has no such rule
 * behind it.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function friendRequestSubject({
  senderName,
}: Pick<FriendRequestEmailProps, "senderName">): string {
  return `${senderName} sent you a friend request`;
}

export function friendRequestText({
  senderName,
  senderUsername,
  unsubscribeUrl,
}: FriendRequestEmailProps): string {
  return [
    `${senderName} (@${senderUsername}) sent you a friend request on CourseCal.`,
    "",
    `Accept it here: ${emailOrigin()}/friends`,
    "",
    `Don't want these emails? Turn them off: ${unsubscribeUrl}`,
  ].join("\n");
}

/**
 * Deliberately plain: one message, one call to action, no explanation of what
 * CourseCal is and no marketing copy. Filters read a product pitch attached to
 * a notification as bulk mail, and this is going to a single Microsoft 365
 * tenant where that judgement, once made, applies to everyone.
 */
export function friendRequestHtml({
  senderName,
  senderUsername,
  senderAvatar,
  unsubscribeUrl,
}: FriendRequestEmailProps): string {
  const name = escapeHtml(senderName);
  const username = escapeHtml(senderUsername);

  const avatar = senderAvatar
    ? `<img src="${escapeHtml(senderAvatar)}" width="56" height="56" alt=""
           style="display:block;width:56px;height:56px;border-radius:28px;object-fit:cover;border:0" />`
    : `<div style="width:56px;height:56px;border-radius:28px;background-color:#e4e4e7;
             font-family:${FONT_STACK};font-size:22px;font-weight:600;line-height:56px;
             color:#71717b;text-align:center">${escapeHtml(
               senderName.charAt(0).toUpperCase(),
             )}</div>`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${name} sent you a friend request</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f5">
    <!-- Inbox preview line; hidden in the message body itself. -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0">
      Accept it to compare schedules and find time when you're both free.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="background-color:#f4f4f5">
      <tr>
        <td align="center" style="padding:40px 16px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                 style="max-width:440px">
            <tr>
              <td style="background-color:#ffffff;border:1px solid #e4e4e7;border-radius:12px;padding:40px 32px">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px">
                  <tr><td>${avatar}</td></tr>
                </table>

                <p style="margin:0 0 12px;font-family:${FONT_STACK};font-size:22px;font-weight:600;
                          line-height:1.3;color:#09090b;text-align:center">
                  ${name} sent you a friend request
                </p>

                <p style="margin:0 0 28px;font-family:${FONT_STACK};font-size:15px;line-height:1.6;
                          color:#71717b;text-align:center">
                  @${username}
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto">
                  <tr>
                    <td align="center" bgcolor="#fb2c36" style="border-radius:8px">
                      <a href="${emailOrigin()}/friends"
                         style="display:inline-block;padding:13px 30px;font-family:${FONT_STACK};
                                font-size:15px;font-weight:600;line-height:1;color:#ffffff;
                                text-decoration:none;border-radius:8px">
                        View request
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding-top:24px;font-family:${FONT_STACK};font-size:13px;
                                        line-height:1.6;color:#71717b">
                <a href="${escapeHtml(unsubscribeUrl)}" style="color:#71717b;text-decoration:underline">
                  Turn off friend request emails
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
