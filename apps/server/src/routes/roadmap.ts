import { Router } from "express";

import { adminAuthMiddleware } from "#middleware/adminAuth";

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

router.get("/", getRoadmapController);
router.get("/stats", getRoadmapStatsController);
router.get("/:id", getRoadmapFeatureByIdController);

router.post("/admin", adminAuthMiddleware, createRoadmapFeatureController);
router.put("/admin/:id", adminAuthMiddleware, updateRoadmapFeatureController);
router.delete("/admin/:id", adminAuthMiddleware, deleteRoadmapFeatureController);

export default router;
