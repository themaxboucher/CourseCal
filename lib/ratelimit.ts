import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a connection to your Upstash Redis database
// Redis.fromEnv() automatically reads UPSTASH_REDIS_REST_URL
// and UPSTASH_REDIS_REST_TOKEN from environment variables
const redis = Redis.fromEnv();

// Create the rate limiter
// "slidingWindow(3, '1 h')" means: allow 3 requests per 1 hour per IP
export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
});

