import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

// Públicas
router.post("/register", userController.register);
router.post("/login", userController.login);

// Solo admin
router.get("/", verifyToken, requireRole("admin"), userController.getAll);
router.post("/", verifyToken, requireRole("admin"), userController.create);
router.get("/:id", verifyToken, requireRole("admin"), userController.getById);
router.put("/:id", verifyToken, requireRole("admin"), userController.update);
router.patch("/:id/deactivate", verifyToken, requireRole("admin"), userController.softDelete);

export default router;