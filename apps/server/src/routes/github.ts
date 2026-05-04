import { Router } from "express";

import { adminAuthMiddleware } from "#middleware/adminAuth";

import {
  getGitHubStatsController,
  getGitHubIssuesController,
  syncGitHubStatsAsAdminController,
} from "#controllers/githubController";

const router = Router();

router.get("/stats", getGitHubStatsController);
router.get("/issues", getGitHubIssuesController);

router.post("/admin/sync", adminAuthMiddleware, syncGitHubStatsAsAdminController);

export default router;
