import { Router } from "express";
import * as orderController from "../controllers/orderController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";
import { ROLES, STAFF_ROLES } from "../utils/constants.js";

const router = Router();

// Todas las rutas de pedidos requieren token
router.use(verifyToken);

// Crea pedidos: cualquier rol (el service decide el cliente según el rol)
router.post("/", orderController.create); // CAMBIO: antes solo client y staff

// Cada rol ve lo suyo: el orderService filtra por usuario
router.get("/", orderController.getAll);
router.get("/:id", orderController.getById);

// Corrección del pedido: admin y staff
router.put("/:id", requireRole(...STAFF_ROLES), orderController.update); // AGREGADA

// Gestión de estado: admin y staff
router.patch("/:id/status", requireRole(...STAFF_ROLES), orderController.updateStatus);

// El cliente cancela su propio pedido
router.patch("/:id/cancel", requireRole(ROLES.CLIENT), orderController.cancel); // AGREGADA

// Soft delete y delete físico: solo admin
router.patch("/:id/deactivate", requireRole(ROLES.ADMIN), orderController.softDelete);
router.delete("/:id", requireRole(ROLES.ADMIN), orderController.remove);

export default router;