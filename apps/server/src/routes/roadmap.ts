import { Router } from "express";

import { flexibleAuth } from "#middleware/flexibleAuth";
import { adminAuthMiddleware } from "#middleware/adminAuth";
import { requireApiKeyScopes } from "#middleware/apiKeyScope";

import {
  getRoadmapController,
  getRoadmapStatsController,
  getRoadmapFeatureByIdController,
} from "#controllers/roadmapController";
import {
  createRoadmapFeatureController,
  updateRoadmapFeatureController,
  deleteRoadmapFeatureController,
} from "#controllers/admin/adminRoadmapController";

const router = Router();

router.get("/", flexibleAuth, requireApiKeyScopes("roadmap:read"), getRoadmapController);
router.get("/stats", flexibleAuth, requireApiKeyScopes("roadmap:read"), getRoadmapStatsController);
router.get(
  "/:id",
  flexibleAuth,
  requireApiKeyScopes("roadmap:read"),
  getRoadmapFeatureByIdController,
);

router.post("/admin", adminAuthMiddleware, createRoadmapFeatureController);
router.put("/admin/:id", adminAuthMiddleware, updateRoadmapFeatureController);
router.delete("/admin/:id", adminAuthMiddleware, deleteRoadmapFeatureController);

export default router;
