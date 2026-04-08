import { Router } from "express";

import {
  getResumeController,
  listResumesController,
  exportResumeController,
  getMasterProfileController,
  updateResumeSyncController,
  updateMasterProfileController,
  listResumeShareLinksController,
  createResumeExportJobController,
  createResumeShareLinkController,
  revokeResumeShareLinkController,
  downloadResumeExportJobController,
  getResumeExportJobStatusController,
} from "#controllers/resumeController";

const router = Router();

router.get("/", listResumesController);
router.get("/:resumeId", getResumeController);
router.get("/profile", getMasterProfileController);
router.put("/profile", updateMasterProfileController);
router.post("/:resumeId/export", exportResumeController);
router.put("/:resumeId/sync", updateResumeSyncController);
router.get("/:resumeId/share-links", listResumeShareLinksController);
router.get("/export-jobs/:jobId", getResumeExportJobStatusController);
router.post("/:resumeId/share-links", createResumeShareLinkController);
router.post("/:resumeId/export/jobs", createResumeExportJobController);
router.get("/export-jobs/:jobId/download", downloadResumeExportJobController);
router.delete("/:resumeId/share-links/:shareLinkId", revokeResumeShareLinkController);

export default router;
