import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

// Públicas
router.post("/register", userController.register);
router.post("/login", userController.login);

// Solo admin
router.get("/", verifyToken, requireRole(ROLES.ADMIN), userController.getAll);
router.post("/", verifyToken, requireRole(ROLES.ADMIN), userController.create);
router.get("/:id", verifyToken, requireRole(ROLES.ADMIN), userController.getById);
router.put("/:id", verifyToken, requireRole(ROLES.ADMIN), userController.update);
router.patch("/:id/deactivate", verifyToken, requireRole(ROLES.ADMIN), userController.softDelete);

export default router;