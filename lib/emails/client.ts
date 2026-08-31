import { Resend } from "resend";
import { requireEnv } from "@/lib/env";

/**
 * Notification mail is sent from its own subdomain, deliberately separate from
 * the one GoTrue uses for magic links. If enough people mark a friend request
 * as junk, the reputation damage does not affect and login links
 */
export const NOTIFICATION_FROM = "CourseCal <hello@coursecal.com>";

let client: Resend | null = null;

/**
 * Built on first use rather than at module load. `requireEnv` throws, and a
 * throw while this module is being imported would take down every route that
 * reaches it through the import graph, including all the ones that never send
 * anything.
 */
export function resend(): Resend {
  if (!client) {
    client = new Resend(requireEnv("RESEND_API_KEY"));
  }
  return client;
}
