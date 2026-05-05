import { Router } from "express";

import { flexibleAuth } from "#middleware/flexibleAuth";
import { requireApiKeyScopes } from "#middleware/apiKeyScope";

import { getCurrentUserController, updateUserNameController } from "#controllers/userController";

const router = Router();

router.use(flexibleAuth);

router.get("/me", requireApiKeyScopes("user:read"), getCurrentUserController);
router.put("/me/name", requireApiKeyScopes("user:write"), updateUserNameController);

export default router;
