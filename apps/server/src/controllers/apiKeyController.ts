import { Request, Response } from "express";

import { requireAuthUser } from "#middleware/auth";

import { ApiKeyService } from "#services/apiKeyService";

import { logger } from "#utils/logger";
import { createSuccessResponse, createErrorResponse } from "#utils/errors";

const DEFAULT_ALLOWED_SCOPES = [
  "user:read",
  "user:write",
  "resume:read",
  "resume:write",
  "roadmap:read",
  "roadmap:write",
  "github:read",
  "github:write",
];

function parseScopes(value: unknown) {
  if (!value) {
    return undefined;
  }

  const rawScopes = Array.isArray(value) ? value : String(value).split(",");
  const scopes = rawScopes.map((scope) => String(scope).trim()).filter(Boolean);

  if (scopes.length === 0) {
    return undefined;
  }

  const invalidScopes = scopes.filter((scope) => !DEFAULT_ALLOWED_SCOPES.includes(scope));
  if (invalidScopes.length > 0) {
    throw new Error(`Unsupported API key scope(s): ${invalidScopes.join(", ")}`);
  }

  return scopes;
}

function parseRateLimit(value: unknown) {
  if (value == null || value === "") {
    return undefined;
  }

  const limit = Number(value);
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("rateLimit must be a positive integer");
  }

  return limit;
}

function parseExpiresAt(value: unknown) {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("expiresAt must be a valid ISO date string");
  }

  return parsed;
}

export class ApiKeyController {
  static async listKeys(req: Request, res: Response) {
    try {
      const userId = requireAuthUser(req).id;
      const keys = await ApiKeyService.listKeys(userId);

      res.status(200).json(createSuccessResponse(keys, "API keys fetched successfully"));
    } catch (error) {
      logger.error("Failed to list API keys", error);
      res.status(500).json(createErrorResponse(500, "Failed to fetch API keys"));
    }
  }

  static async createKey(req: Request, res: Response) {
    try {
      const userId = requireAuthUser(req).id;

      const { name, scopes, rateLimit, expiresAt } = req.body;

      if (!name) {
        return res.status(400).json(createErrorResponse(400, "Key name is required"));
      }

      const apiKey = await ApiKeyService.generateKey(userId, {
        name,
        scopes: parseScopes(scopes),
        rateLimit: parseRateLimit(rateLimit),
        expiresAt: parseExpiresAt(expiresAt),
      });

      res
        .status(201)
        .json(
          createSuccessResponse(
            apiKey,
            "API key generated successfully. Please save it as it won't be shown again.",
          ),
        );
    } catch (error) {
      logger.error("Failed to create API key", error);
      const message = error instanceof Error ? error.message : "Failed to generate API key";
      res.status(400).json(createErrorResponse(400, message));
    }
  }

  static async rotateKey(req: Request, res: Response) {
    try {
      const userId = requireAuthUser(req).id;

      const { id } = req.params;
      const { name, scopes, rateLimit, expiresAt } = req.body;

      const rotated = await ApiKeyService.rotateKey(userId, id, {
        name,
        scopes: parseScopes(scopes),
        rateLimit: parseRateLimit(rateLimit),
        expiresAt: parseExpiresAt(expiresAt),
      });

      if (!rotated) {
        return res.status(404).json(createErrorResponse(404, "API key not found"));
      }

      return res
        .status(201)
        .json(
          createSuccessResponse(
            rotated,
            "API key rotated successfully. Please save the new key immediately.",
          ),
        );
    } catch (error) {
      logger.error("Failed to rotate API key", error);
      const message = error instanceof Error ? error.message : "Failed to rotate API key";
      return res.status(400).json(createErrorResponse(400, message));
    }
  }

  static async revokeKey(req: Request, res: Response) {
    try {
      const userId = requireAuthUser(req).id;

      const { id } = req.params;

      const revokedCount = await ApiKeyService.revokeKey(userId, id);

      if (revokedCount === 0) {
        return res.status(404).json(createErrorResponse(404, "API key not found"));
      }

      res.status(200).json(createSuccessResponse(null, "API key revoked successfully"));
    } catch (error) {
      logger.error("Failed to revoke API key", error);
      res.status(500).json(createErrorResponse(500, "Failed to revoke API key"));
    }
  }

  static async deleteKey(req: Request, res: Response) {
    try {
      const userId = requireAuthUser(req).id;

      const { id } = req.params;

      const deletedCount = await ApiKeyService.deleteKey(userId, id);

      if (deletedCount === 0) {
        return res.status(404).json(createErrorResponse(404, "API key not found"));
      }

      res.status(200).json(createSuccessResponse(null, "API key deleted successfully"));
    } catch (error) {
      logger.error("Failed to delete API key", error);
      res.status(500).json(createErrorResponse(500, "Failed to delete API key"));
    }
  }
}
