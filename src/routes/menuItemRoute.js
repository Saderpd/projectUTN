import { Router } from "express";
import * as menuItemController from "../controllers/menuItemController.js";

const router = Router();

// Lectura pública
router.get("/", menuItemController.getAll);
router.get("/:id", menuItemController.getById);

// Escritura: más adelante se protege con verifyToken y rol admin
router.post("/", menuItemController.create);
router.put("/:id", menuItemController.update);

// SOFT DELETE (el que usa la app)
router.patch("/:id/deactivate", menuItemController.softDelete);

// DELETE (solo por la consigna)
router.delete("/:id", menuItemController.remove);

export default router;