import { Router } from "express";

import { authMiddleware } from "#middleware/auth";

import { ApiKeyController } from "#controllers/apiKeyController";

const router = Router();

router.use(authMiddleware);

router.get("/", ApiKeyController.listKeys);
router.post("/", ApiKeyController.createKey);
router.post("/:id/rotate", ApiKeyController.rotateKey);
router.post("/:id/revoke", ApiKeyController.revokeKey);
router.delete("/:id", ApiKeyController.deleteKey);

export default router;
