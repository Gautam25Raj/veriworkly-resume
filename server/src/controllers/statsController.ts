import { z } from "zod";
import { Request, Response, NextFunction } from "express";

import { createSuccessResponse } from "#utils/errors";

import { getGitHubStats, syncGitHubStatsFromGitHub } from "#services/statsService";
import { getAdminDashboardMetrics, incrementUsageMetric } from "#services/analyticsService";

/**
 * Zod validation schema for incoming usage metrics.
 * Ensures the event name is a non-empty string and the value is a positive integer (max 1000).
 */

const usageMetricEventSchema = z.object({
  event: z.string().trim().min(1),
  value: z.number().int().positive().max(1000).optional(),
});

/**
 * Return the latest GitHub stats snapshot stored in the database/cache.
 *
 * res:
 * - 200: Returns the latest stats object or null if no snapshot exists.
 *
 * next:
 * - Forwards runtime/database errors to the global error handler.
 */

const getGitHubStatsController = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getGitHubStats();

    const message = stats ? "GitHub stats fetched successfully" : "No GitHub stats available yet";

    res.json(createSuccessResponse(stats, message));
  } catch (error) {
    next(error);
  }
};

/**
 * Trigger an immediate GitHub sync via the Admin Dashboard.
 *
 * req:
 * - (unused, protected by adminAuthMiddleware)
 *
 * res:
 * - 200: Returns the freshly synced GitHub snapshot.
 *
 * next:
 * - Forwards GitHub API errors or database upsert errors to the global error handler.
 */

const syncGitHubStatsAsAdminController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sync = await syncGitHubStatsFromGitHub();
    res.json(createSuccessResponse(sync, "GitHub stats synced successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Record a single usage metric (e.g., resume_created) into Redis.
 *
 * req:
 * - body: { event: string, value?: number }
 *
 * res:
 * - 202: "Accepted" - signifies the metric is validated and queued for background processing.
 *
 * next:
 * - Forwards Zod validation errors or Redis connection issues to the error handler.
 */

const recordUsageMetricController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = usageMetricEventSchema.parse(req.body);
    await incrementUsageMetric(payload);

    res.status(202).json(createSuccessResponse({ accepted: true }, "Metric accepted"));
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch aggregated data for the Admin Dashboard, including GitHub and usage stats.
 *
 * req:
 * - (unused, protected by adminAuthMiddleware)
 *
 * res:
 * - 200: Returns combined githubStats and usageMetrics.
 *
 * next:
 * - Forwards service-level errors to the global error handler.
 */

const getAdminDashboardStatsController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [githubStats, usageMetrics] = await Promise.all([
      getGitHubStats(),
      getAdminDashboardMetrics(),
    ]);

    res.json(
      createSuccessResponse(
        { githubStats, usageMetrics },
        "Admin dashboard stats fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

export {
  getGitHubStatsController,
  recordUsageMetricController,
  getAdminDashboardStatsController,
  syncGitHubStatsAsAdminController,
};
