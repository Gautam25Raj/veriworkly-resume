import { createClient } from "redis";
import { config } from "@/config";

let redisClient: ReturnType<typeof createClient> | null = null;

export async function initRedis() {
  try {
    redisClient = createClient({
      url: config.redis.url,
    });

    redisClient.on("error", (err) => {
      console.error("Redis Client Error", err);
    });

    redisClient.on("connect", () => {
      console.log("Redis Client Connected");
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error("Failed to initialize Redis:", error);
    throw error;
  }
}

export function getRedis() {
  if (!redisClient) {
    throw new Error("Redis client not initialized");
  }
  return redisClient;
}

export async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
  }
}

// Helper functions for caching
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedis();
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Cache get error:", error);
    return null;
  }
}

export async function cacheSet<T>(
  key: string,
  value: T,
  expirationSeconds: number = 3600,
): Promise<void> {
  try {
    const redis = getRedis();
    await redis.setEx(key, expirationSeconds, JSON.stringify(value));
  } catch (error) {
    console.error("Cache set error:", error);
  }
}

export async function cacheDel(key: string): Promise<void> {
  try {
    const redis = getRedis();
    await redis.del(key);
  } catch (error) {
    console.error("Cache del error:", error);
  }
}

export async function cacheDelByPrefix(prefix: string): Promise<void> {
  try {
    const redis = getRedis();
    let cursor = 0;

    do {
      const result = await redis.scan(cursor, {
        MATCH: `${prefix}*`,
        COUNT: 100,
      });

      cursor = result.cursor;
      if (result.keys.length > 0) {
        await redis.del(result.keys);
      }
    } while (cursor !== 0);
  } catch (error) {
    console.error("Cache prefix delete error:", error);
  }
}

export async function cacheFlush(): Promise<void> {
  try {
    const redis = getRedis();
    await redis.flushDb();
  } catch (error) {
    console.error("Cache flush error:", error);
  }
}
