import { Router } from "express";

import { adminAuthMiddleware } from "#middleware/adminAuth";

import {
  recordUsageMetricController,
  getAdminDashboardStatsController,
} from "#controllers/statsController";

const router = Router();

router.post("/events", recordUsageMetricController);

router.get("/admin/dashboard", adminAuthMiddleware, getAdminDashboardStatsController);

export default router;
