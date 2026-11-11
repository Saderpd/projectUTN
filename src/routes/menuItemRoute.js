import { Router } from "express";
import * as menuItemController from "../controllers/menuItemController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

// Pública
router.get("/", menuItemController.getAll);
router.get("/:id", menuItemController.getById);

// Solo admin
router.post("/", verifyToken, requireRole(ROLES.ADMIN), menuItemController.create);
router.put("/:id", verifyToken, requireRole(ROLES.ADMIN), menuItemController.update);

// Soft delete
router.patch("/:id/deactivate", verifyToken, requireRole(ROLES.ADMIN), menuItemController.softDelete);

// Delete (solo por la consigna)
router.delete("/:id", verifyToken, requireRole(ROLES.ADMIN), menuItemController.remove);

export default router;