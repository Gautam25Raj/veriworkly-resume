import { Request, Response, NextFunction } from "express";

import { config } from "@/config";

import { logger } from "@/utils/logger";
import { prisma } from "@/utils/prisma";
import { getRedis } from "@/utils/redis";
import { createErrorResponse } from "@/utils/errors";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const bucket = new Map<string, RateLimitEntry>();

function getClientKey(req: Request): string {
  return req.ip || req.socket.remoteAddress || "unknown";
}

function getRouteLimitConfig(req: Request) {
  const isAuthRoute = req.path.startsWith("/api/v1/auth");

  return {
    windowMs: isAuthRoute ? config.rateLimit.authWindowMs : config.rateLimit.windowMs,
    maxRequests: isAuthRoute ? config.rateLimit.authMaxRequests : config.rateLimit.maxRequests,
  };
}

function pruneExpiredEntries(now: number) {
  for (const [key, entry] of bucket.entries()) {
    if (entry.resetAt <= now) {
      bucket.delete(key);
    }
  }
}

export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const now = Date.now();
  const { windowMs, maxRequests } = getRouteLimitConfig(req);

  pruneExpiredEntries(now);

  const key = getClientKey(req);

  const redisKey = `rate-limit:${req.method}:${req.path}:${key}`;

  const checkWithFallback = async () => {
    try {
      const redis = getRedis();
      const count = await redis.incr(redisKey);

      if (count === 1) {
        await redis.pExpire(redisKey, windowMs);
      }

      return count;
    } catch {
      const current = bucket.get(redisKey);

      if (!current || current.resetAt <= now) {
        bucket.set(redisKey, { count: 1, resetAt: now + windowMs });
        return 1;
      }

      current.count += 1;
      return current.count;
    }
  };

  checkWithFallback()
    .then((count) => {
      if (count <= maxRequests) {
        next();
        return;
      }

      logger.warn(`Rate limit exceeded for IP: ${key}`);

      prisma.auditLog
        .create({
          data: {
            method: req.method,
            path: req.originalUrl,
            status: 429,
            ip: key,
            userAgent: req.headers["user-agent"],
            error: "Rate limit exceeded",
          },
        })
        .catch((err) => logger.error("Failed to log rate limit violation", err));

      res.status(429).json(createErrorResponse(429, "Too many requests. Please try again later."));
    })
    .catch((err) => {
      logger.error("Rate limit middleware failure", err);
      next();
    });
};
