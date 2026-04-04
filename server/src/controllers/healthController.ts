import { Request, Response } from "express";

import prisma from "#utils/prisma";
import { logger } from "#utils/logger";
import { getRedis } from "#utils/redis";
import { createErrorResponse, createSuccessResponse } from "#utils/errors";

/**
 * Basic health endpoint to confirm service liveness.
 *
 * req:
 * - unused
 *
 * res:
 * - 200 with status and ISO timestamp
 */

export async function healthController(_req: Request, res: Response) {
  try {
    await prisma.$queryRaw`SELECT 1`;

    const redis = getRedis();
    await redis.ping();

    res.json(
      createSuccessResponse(
        {
          status: "ok",
          database: "connected",
          redis: "connected",
          timestamp: new Date().toISOString(),
        },
        "Server is healthy",
      ),
    );
  } catch (error) {
    logger.error("Health check failed", error);
    res.status(503).json(createErrorResponse(503, "Service Unavailable"));
  }
}
