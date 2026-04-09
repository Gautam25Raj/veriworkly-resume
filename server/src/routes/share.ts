import { Router } from "express";

import {
  getPublicShareLinkController,
  exportPublicShareLinkController,
  verifyPublicShareLinkController,
  createPublicShareExportJobController,
  downloadPublicShareExportJobController,
  getPublicShareExportJobStatusController,
} from "#controllers/resumeController";

const router = Router();

router.get("/:token", getPublicShareLinkController);
router.post("/:token/verify", verifyPublicShareLinkController);
router.get("/:token/export", exportPublicShareLinkController);
router.post("/:token/export/jobs", createPublicShareExportJobController);
router.get("/:token/export/jobs/:jobId", getPublicShareExportJobStatusController);
router.get("/:token/export/jobs/:jobId/download", downloadPublicShareExportJobController);

export default router;
