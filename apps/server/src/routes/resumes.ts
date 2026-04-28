import { Router } from "express";

import {
  getResumeController,
  listResumesController,
  updateResumeSyncController,
} from "#controllers/resumeController";
import { authMiddleware } from "#middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", listResumesController);
router.get("/:resumeId", getResumeController);
router.put("/:resumeId/sync", updateResumeSyncController);

export default router;
