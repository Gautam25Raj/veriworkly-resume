import { Router } from "express";

import { flexibleAuth } from "#middleware/flexibleAuth";
import { adminAuthMiddleware } from "#middleware/adminAuth";
import { requireApiKeyScopes } from "#middleware/apiKeyScope";

import {
  getGitHubStatsController,
  getGitHubIssuesController,
  syncGitHubStatsAsAdminController,
} from "#controllers/githubController";

const router = Router();

router.get("/stats", flexibleAuth, requireApiKeyScopes("github:read"), getGitHubStatsController);
router.get("/issues", flexibleAuth, requireApiKeyScopes("github:read"), getGitHubIssuesController);

router.post("/admin/sync", adminAuthMiddleware, syncGitHubStatsAsAdminController);

export default router;
