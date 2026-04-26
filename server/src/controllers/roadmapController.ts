import { z } from "zod";
import { Request, Response, NextFunction } from "express";

import {
  type RoadmapSort,
  type RoadmapStatus,
  getRoadmapStats,
  getRoadmapFeatures,
  getRoadmapFeatureById,
} from "#services/roadmapService";

import { roadmapQuerySchema } from "#validators/roadmapValidator";

import { ApiError, createSuccessResponse, handleValidationError } from "#utils/errors";

/**
 * Get roadmap features with filtering, sorting, and pagination.
 *
 * @param req Express request (query: status, sort, limit, offset)
 * @param res Express response
 * @param next Express next middleware
 *
 * Response:
 * - 200: Paginated roadmap feature list
 *
 * Errors:
 * - 400: Validation error
 * - 500: Server error
 */

const getRoadmapController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = roadmapQuerySchema.parse(req.query);

    const result = await getRoadmapFeatures({
      status: query.status as RoadmapStatus | undefined,
      sort: query.sort as RoadmapSort | undefined,
      limit: Number(query.limit) >= 20 ? 20 : query.limit,
      offset: query.offset,
    });

    res.json(createSuccessResponse(result, "Roadmap features fetched successfully"));
  } catch (error) {
    if (error instanceof z.ZodError) return next(handleValidationError(error));

    next(error);
  }
};

/**
 * Get aggregated roadmap statistics.
 *
 * @param _req Express request (unused)
 * @param res Express response
 * @param next Express next middleware
 *
 * Response:
 * - 200: Roadmap stats summary
 *
 * Errors:
 * - 500: Server error
 */

const getRoadmapStatsController = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getRoadmapStats();
    res.json(createSuccessResponse(stats, "Roadmap stats fetched successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Get a roadmap feature by ID.
 *
 * @param req Express request (params: id)
 * @param res Express response
 * @param next Express next middleware
 *
 * Response:
 * - 200: Roadmap feature details
 *
 * Errors:
 * - 400: Missing ID
 * - 404: Feature not found
 * - 500: Server error
 */

const getRoadmapFeatureByIdController = async (req: Request, res: Response, next: NextFunction) => {
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
};

export { getRoadmapController, getRoadmapStatsController, getRoadmapFeatureByIdController };
