import { Router } from "express";

import {
  createResumeExportJobController,
  getResumeExportJobStatusController,
  downloadResumeExportJobController,
  exportResumeDirectController,
  createPublicShareExportJobController,
  getPublicShareExportJobStatusController,
  downloadPublicShareExportJobController,
  exportPublicShareDirectController,
} from "#controllers/exportController";
import { authMiddleware } from "#middleware/auth";

const router = Router();

// Protected routes (authentication required)

/**
 * Queue an export job
 * POST /exports/resumes/:resumeId/jobs
 */
router.post("/resumes/:resumeId/jobs", authMiddleware, createResumeExportJobController);

/**
 * Get export job status
 * GET /exports/jobs/:jobId
 */
router.get("/jobs/:jobId", authMiddleware, getResumeExportJobStatusController);

/**
 * Download export job artifact
 * GET /exports/jobs/:jobId/download
 */
router.get("/jobs/:jobId/download", authMiddleware, downloadResumeExportJobController);

/**
 * Direct export without queueing
 * POST /exports/resumes/:resumeId/direct
 */
router.post("/resumes/:resumeId/direct", authMiddleware, exportResumeDirectController);

// Public routes (no authentication)

/**
 * Queue export job for public share
 * POST /exports/shares/:token/jobs
 */
router.post("/shares/:token/jobs", createPublicShareExportJobController);

/**
 * Get public share export job status
 * GET /exports/shares/:token/jobs/:jobId
 */
router.get("/shares/:token/jobs/:jobId", getPublicShareExportJobStatusController);

/**
 * Download public share export job artifact
 * GET /exports/shares/:token/jobs/:jobId/download
 */
router.get("/shares/:token/jobs/:jobId/download", downloadPublicShareExportJobController);

/**
 * Direct export for public share
 * POST /exports/shares/:token/direct
 */
router.post("/shares/:token/direct", exportPublicShareDirectController);

export default router;
