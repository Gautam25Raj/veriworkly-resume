import { z } from "zod";
import { Request, Response, NextFunction } from "express";

import * as githubService from "#services/githubService";

import { createSuccessResponse, handleValidationError } from "#utils/errors";

const githubQuerySchema = z.object({
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  kind: z.enum(["issue", "pull-request", "all"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

const getGitHubStatsController = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await githubService.getGitHubStats();

    res.json(createSuccessResponse(stats, "Stats fetched successfully"));
  } catch (error) {
    next(error);
  }
};

const getGitHubIssuesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = githubQuerySchema.parse(req.query);
    const result = await githubService.getGitHubIssues(query);

    res.json(createSuccessResponse(result, "Issues fetched successfully"));
  } catch (error) {
    if (error instanceof z.ZodError) return next(handleValidationError(error));
    next(error);
  }
};

const syncGitHubStatsAsAdminController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const syncResult = await githubService.syncGitHubStatsFromGitHub();

    res.json(createSuccessResponse(syncResult, "Manual sync completed"));
  } catch (error) {
    next(error);
  }
};

export { getGitHubStatsController, getGitHubIssuesController, syncGitHubStatsAsAdminController };
