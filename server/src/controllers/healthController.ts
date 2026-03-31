import { Request, Response } from "express";

import { createSuccessResponse } from "@/utils/errors";

/**
 * Basic health endpoint to confirm service liveness.
 *
 * req:
 * - unused
 *
 * res:
 * - 200 with status and ISO timestamp
 */

export function healthController(_req: Request, res: Response) {
  res.json(
    createSuccessResponse(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
      },
      "Server is healthy",
    ),
  );
}
