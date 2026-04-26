import { Router } from "express";

import { authMiddleware } from "#middleware/auth";

import {
  exportResumeDirectController,
  createResumeExportJobController,
  downloadResumeExportJobController,
  getResumeExportJobStatusController,
  createPublicShareExportJobController,
  downloadPublicShareExportJobController,
  getPublicShareExportJobStatusController,
} from "#controllers/exportController";

const router = Router();

// Protected routes (authentication required)
router.post("/resumes/:resumeId/direct", authMiddleware, exportResumeDirectController);
router.post("/resumes/:resumeId/jobs", authMiddleware, createResumeExportJobController);

router.get("/jobs/:jobId", authMiddleware, getResumeExportJobStatusController);
router.get("/jobs/:jobId/download", authMiddleware, downloadResumeExportJobController);

// Public routes (no authentication)
router.post("/shares/:token/jobs", createPublicShareExportJobController);
router.get("/shares/:token/jobs/:jobId", getPublicShareExportJobStatusController);
router.get("/shares/:token/jobs/:jobId/download", downloadPublicShareExportJobController);

export default router;
