import { z } from "zod";
import { Request, Response, NextFunction } from "express";

import { createSuccessResponse } from "#utils/errors";

import { getGitHubStats } from "#services/githubService";
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
    if (process.env.NODE_ENV === "development")
      return res.status(202).json("Skipping metric recording in development mode");

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

export { recordUsageMetricController, getAdminDashboardStatsController };
