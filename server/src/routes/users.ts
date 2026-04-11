import { Router } from "express";

import { getCurrentUserController, updateUserNameController } from "#controllers/userController";
import { authMiddleware } from "#middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/me", getCurrentUserController);
router.put("/me/name", updateUserNameController);

export default router;
