import { Redis } from "ioredis";

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function rateLimit({ key, limit, windowSec }: { key: string; limit: number; windowSec: number }) {
  const now = Math.floor(Date.now() / 1000);
  const k = `rl:${key}:${Math.floor(now / windowSec)}`;
  const n = await redis.incr(k);
  if (n === 1) await redis.expire(k, windowSec);
  return n <= limit;
}

export async function getRateLimitInfo(key: string, windowSec: number) {
  const now = Math.floor(Date.now() / 1000);
  const k = `rl:${key}:${Math.floor(now / windowSec)}`;
  const current = await redis.get(k);
  return current ? parseInt(current) : 0;
}
