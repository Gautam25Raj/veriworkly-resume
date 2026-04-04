import { Router } from "express";

import { adminAuthMiddleware } from "@/middleware/adminAuth";

import {
  getGitHubStatsController,
  recordUsageMetricController,
  getAdminDashboardStatsController,
  syncGitHubStatsAsAdminController,
} from "@/controllers/statsController";

const router = Router();

router.get("/github", getGitHubStatsController);
router.post("/events", recordUsageMetricController);

router.get("/admin/dashboard", adminAuthMiddleware, getAdminDashboardStatsController);
router.post("/admin/github/sync", adminAuthMiddleware, syncGitHubStatsAsAdminController);

export default router;
