import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";
import { env } from "@/config/env";

// Fallback logic if Upstash Redis credentials are not provided (e.g. local dev without it)
const isRedisConfigured = env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN;

const redis = isRedisConfigured
  ? new Redis({
      url: env.UPSTASH_REDIS_REST_URL!,
      token: env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// Default ratelimit: 10 requests per 10 seconds
export const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
    })
  : null;

export async function checkRateLimit(req: NextRequest, identifier: string = "ip", customLimit?: number, customWindow?: string) {
  if (!ratelimit || !redis) {
    // If Redis is not configured, bypass rate limiting
    return { success: true, limit: 10, remaining: 10, reset: 0 };
  }

  let limitInstance = ratelimit;

  // Create a custom ratelimit instance if needed, but we'll use the default for simplicity mostly
  if (customLimit && customWindow) {
    limitInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(customLimit, customWindow as any),
      analytics: true,
    });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const id = identifier === "ip" ? ip : identifier;

  const { success, limit, remaining, reset } = await limitInstance.limit(id);

  return { success, limit, remaining, reset };
}
