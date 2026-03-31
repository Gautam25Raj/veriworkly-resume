import { z } from "zod";
import { Request, Response, NextFunction } from "express";

import {
  type RoadmapSort,
  type RoadmapStatus,
  getRoadmapStats,
  getRoadmapFeatures,
  getRoadmapFeatureById,
} from "@/services/roadmapService";

import { roadmapQuerySchema } from "@/validators/roadmapValidator";

import { ApiError, createSuccessResponse, handleValidationError } from "@/utils/errors";

/**
 * Get roadmap features with optional filtering/sorting/pagination from query params.
 *
 * req.query:
 * - status: feature status filter (optional)
 * - sort: sorting strategy (optional)
 * - limit: max number of items (optional)
 * - offset: pagination offset (optional)
 *
 * res:
 * - 200 with normalized roadmap list payload
 *
 * next:
 * - forwards validation/runtime errors to global error handler
 */

export async function getRoadmapController(req: Request, res: Response, next: NextFunction) {
  try {
    const query = roadmapQuerySchema.parse(req.query);

    const result = await getRoadmapFeatures({
      status: query.status as RoadmapStatus | undefined,
      sort: query.sort as RoadmapSort | undefined,
      limit: query.limit,
      offset: query.offset,
    });

    res.json(createSuccessResponse(result, "Roadmap features fetched successfully"));
  } catch (error) {
    if (error instanceof z.ZodError) return next(handleValidationError(error));

    next(error);
  }
}

/**
 * Get aggregated roadmap counters (total, planned, in-progress, completed, etc.).
 *
 * req:
 * - unused
 *
 * res:
 * - 200 with computed roadmap statistics
 *
 * next:
 * - forwards runtime errors to global error handler
 */
export async function getRoadmapStatsController(_req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await getRoadmapStats();
    res.json(createSuccessResponse(stats, "Roadmap stats fetched successfully"));
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single roadmap feature by route param id.
 *
 * req.params:
 * - id: roadmap feature id (required)
 *
 * res:
 * - 200 with feature payload
 *
 * next:
 * - forwards runtime errors to global error handler
 */
export async function getRoadmapFeatureByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Feature ID is required");
    }

    const feature = await getRoadmapFeatureById(id);
    res.json(createSuccessResponse(feature, "Feature fetched successfully"));
  } catch (error) {
    next(error);
  }
}
