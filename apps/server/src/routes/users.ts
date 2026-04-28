import { Router } from "express";

import { authMiddleware } from "#middleware/auth";

import { getCurrentUserController, updateUserNameController } from "#controllers/userController";

const router = Router();

router.use(authMiddleware);

router.get("/me", getCurrentUserController);
router.put("/me/name", updateUserNameController);

export default router;
