import { Router } from "express";

import {
  getPublicShareLinkController,
  listResumeShareLinksController,
  createResumeShareLinkController,
  revokeResumeShareLinkController,
  verifyPublicShareLinkController,
} from "#controllers/shareController";
import { authMiddleware } from "#middleware/auth";

const router = Router();

router.get("/resumes/:resumeId", authMiddleware, listResumeShareLinksController);
router.post("/resumes/:resumeId", authMiddleware, createResumeShareLinkController);
router.delete(
  "/resumes/:resumeId/links/:shareLinkId",
  authMiddleware,
  revokeResumeShareLinkController,
);

router.get("/public/:token", getPublicShareLinkController);
router.post("/public/:token/verify", verifyPublicShareLinkController);

export default router;
