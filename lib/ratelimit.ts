import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a connection to your Upstash Redis database
// Redis.fromEnv() automatically reads UPSTASH_REDIS_REST_URL
// and UPSTASH_REDIS_REST_TOKEN from environment variables
const redis = Redis.fromEnv();

// Create the rate limiter
// "slidingWindow(3, '1 h')" means: allow 3 requests per 1 hour per IP
export const aiRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
});

/**
 * How often one person can be emailed about incoming friend requests.
 *
 * Not abuse protection — the ledger in `email_notifications` already makes a
 * given request impossible to send twice. This is about volume: during an
 * onboarding wave a popular account can collect a dozen requests in a minute,
 * and a dozen separate emails is how you get marked as junk by the one tenant
 * every user shares. Requests that arrive inside the window still show up in
 * the app, they just do not each ring a bell.
 *
 * Keyed by recipient, and given its own prefix so its keys cannot collide with
 * the limiter above.
 */
export const friendRequestEmailRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(1, "1 h"),
  prefix: "ratelimit:friend-request-email",
});
