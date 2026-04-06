import { Request, Response, NextFunction } from "express";

import { config } from "#config";

import { prisma } from "#utils/prisma";
import { logger } from "#utils/logger";

export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = performance.now();

  const ip = req.ip || req.socket.remoteAddress || "unknown";

  const userAgent = req.headers["user-agent"];

  res.on("finish", () => {
    if (res.statusCode >= 400) {
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
