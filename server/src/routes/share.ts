import { Router } from "express";

import {
  getPublicShareLinkController,
  verifyPublicShareLinkController,
} from "#controllers/shareController";

import {
  exportPublicShareDirectController,
  createPublicShareExportJobController,
  downloadPublicShareExportJobController,
  getPublicShareExportJobStatusController,
} from "#controllers/exportController";

const router = Router();

router.get("/:token", getPublicShareLinkController);
router.post("/:token/verify", verifyPublicShareLinkController);
router.post("/:token/export", exportPublicShareDirectController);
router.post("/:token/export/jobs", createPublicShareExportJobController);
router.get("/:token/export/jobs/:jobId", getPublicShareExportJobStatusController);
router.get("/:token/export/jobs/:jobId/download", downloadPublicShareExportJobController);

export default router;
