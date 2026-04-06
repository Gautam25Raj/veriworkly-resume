import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import {
  getGitHubIssues,
  getGitHubStats,
  syncGitHubStatsFromGitHub,
} from "#services/githubService";

import { createSuccessResponse, handleValidationError } from "#utils/errors";

const githubQuerySchema = z.object({
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  kind: z.enum(["issue", "pull-request", "all"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  createdFrom: z.string().datetime().optional(),
  createdTo: z.string().datetime().optional(),
  updatedFrom: z.string().datetime().optional(),
  updatedTo: z.string().datetime().optional(),
});

export async function getGitHubStatsController(_req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await getGitHubStats();
    const message = stats ? "GitHub stats fetched successfully" : "No GitHub stats available yet";

    res.json(createSuccessResponse(stats, message));
  } catch (error) {
    next(error);
  }
}

export async function getGitHubIssuesController(req: Request, res: Response, next: NextFunction) {
  try {
    const query = githubQuerySchema.parse(req.query);

    const result = await getGitHubIssues({
      status: query.status,
      kind: query.kind,
      limit: query.limit,
      offset: query.offset,
      createdFrom: query.createdFrom ? new Date(query.createdFrom) : undefined,
      createdTo: query.createdTo ? new Date(query.createdTo) : undefined,
      updatedFrom: query.updatedFrom ? new Date(query.updatedFrom) : undefined,
      updatedTo: query.updatedTo ? new Date(query.updatedTo) : undefined,
    });

    res.json(createSuccessResponse(result, "GitHub issues fetched successfully"));
  } catch (error) {
    if (error instanceof z.ZodError) return next(handleValidationError(error));

    next(error);
  }
}

export async function syncGitHubStatsAsAdminController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const sync = await syncGitHubStatsFromGitHub();
    res.json(createSuccessResponse(sync, "GitHub stats synced successfully"));
  } catch (error) {
    next(error);
  }
}
