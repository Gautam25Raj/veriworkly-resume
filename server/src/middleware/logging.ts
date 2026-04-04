import { Request, Response, NextFunction } from "express";

import { config } from "#config";

import { prisma } from "#utils/prisma";
import { logger } from "#utils/logger";

declare global {
  namespace Express {
    interface Request {
      startTime: number;
      ip: string;
    }
  }
}

export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  // 1. High-resolution, drift-free timer
  const startTime = performance.now();

  // 2. Extract static values NOW, so we don't block the event loop later
  // when the response is trying to finish.
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  // Directly access the header object instead of using Express's slower .get() method
  const userAgent = req.headers["user-agent"];

  res.on("finish", () => {
    if (res.statusCode >= 400) {
      // Calculate precise duration and round to nearest whole millisecond
      const duration = Math.round(performance.now() - startTime);

      logger.error(`[ERROR] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);

      if (config.nodeEnv === "production") {
        prisma.auditLog
          .create({
            data: {
              method: req.method,
              path: req.originalUrl,
              status: res.statusCode,
              ip,
              userAgent,
              error: res.locals.errorMessage || null,
            },
          })
          .catch((err) => logger.error("Audit log DB write failed", err));
      }
    }
  });

  next();
}
