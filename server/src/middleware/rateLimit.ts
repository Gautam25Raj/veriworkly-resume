import RedisStore from "rate-limit-redis";
import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

import { config } from "@/config";

import { logger } from "@/utils/logger";
import { prisma } from "@/utils/prisma";
import { getRedis } from "@/utils/redis";
import { createErrorResponse } from "@/utils/errors";

// 1. Hold the instance in memory
let limiterInstance: ReturnType<typeof rateLimit> | null = null;

export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 2. Initialize it synchronously ONLY on the very first request
  if (!limiterInstance) {
    limiterInstance = rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.maxRequests,
      standardHeaders: true,
      legacyHeaders: false,

      store: new RedisStore({
        // By the time this runs, initRedis() has safely finished in app.ts
        sendCommand: (...args: string[]) => getRedis().sendCommand(args),
      }),

      handler: (req: Request, res: Response, _next: NextFunction) => {
        const ip = req.ip || req.socket.remoteAddress || "unknown";

        logger.warn(`Rate limit exceeded for IP: ${ip}`);

        prisma.auditLog
          .create({
            data: {
              method: req.method,
              path: req.originalUrl,
              status: 429,
              ip,
              userAgent: req.headers["user-agent"],
              error: "Rate limit exceeded",
            },
          })
          .catch((err) => logger.error("Failed to log rate limit violation", err));

        res
          .status(429)
          .json(createErrorResponse(429, "Too many requests. Please try again later."));
      },
    });
  }

  return limiterInstance(req, res, next);
};
