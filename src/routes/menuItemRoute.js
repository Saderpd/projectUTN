import { Router } from "express";
import * as menuItemController from "../controllers/menuItemController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

// Pública
router.get("/", menuItemController.getAll);
router.get("/:id", menuItemController.getById);

// Solo Admin 
router.post("/", verifyToken, requireRole("admin"), menuItemController.create);
router.put("/:id", verifyToken, requireRole("admin"), menuItemController.update);

// SOFT DELETE
router.patch("/:id/deactivate", verifyToken, requireRole("admin"), menuItemController.softDelete);

// DELETE (solo por la consigna)
router.delete("/:id", verifyToken, requireRole("admin"), menuItemController.remove);

export default router;