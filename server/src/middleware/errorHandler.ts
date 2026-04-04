import { Request, Response, NextFunction } from "express";

import { config } from "#config";

import { logger } from "#utils/logger";
import { ApiError, createErrorResponse } from "#utils/errors";

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ApiError) {
    logger.warn(`API Error [${req.method} ${req.path}]: ${error.message}`, error.details);

    return res
      .status(error.statusCode)
      .json(createErrorResponse(error.statusCode, error.message, error.details));
  }

  // Handle unexpected system errors
  if (error instanceof Error) {
    logger.error(`Unhandled Error [${req.method} ${req.path}]: ${error.message}`, {
      stack: error.stack,
    });

    // In production, never leak the stack trace or internal error messages to the client
    const message = config.nodeEnv === "production" ? "Internal server error" : error.message;
    return res.status(500).json(createErrorResponse(500, message));
  }

  logger.error("Unknown error type", error);
  return res.status(500).json(createErrorResponse(500, "Internal server error"));
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json(createErrorResponse(404, `Endpoint ${req.method} ${req.path} not found`));
}
