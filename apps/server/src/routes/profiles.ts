import { Router } from "express";

import {
  getMasterProfileController,
  updateMasterProfileController,
} from "#controllers/profileController";
import { authMiddleware } from "#middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/master", getMasterProfileController);
router.put("/master", updateMasterProfileController);

export default router;
