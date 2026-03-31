import { Router } from "express";

import { internalApiKeyMiddleware } from "@/middleware/internalAuth";

import {
  getRoadmapController,
  getRoadmapStatsController,
  getRoadmapFeatureByIdController,
} from "@/controllers/roadmapController";
import {
  createRoadmapFeatureController,
  updateRoadmapFeatureController,
  deleteRoadmapFeatureController,
} from "@/controllers/admin/adminRoadmapController";

const router = Router();

router.get("/", getRoadmapController);
router.get("/stats", getRoadmapStatsController);
router.get("/:id", getRoadmapFeatureByIdController);

router.post("/admin", internalApiKeyMiddleware, createRoadmapFeatureController);
router.put("/admin/:id", internalApiKeyMiddleware, updateRoadmapFeatureController);
router.delete("/admin/:id", internalApiKeyMiddleware, deleteRoadmapFeatureController);

export default router;
