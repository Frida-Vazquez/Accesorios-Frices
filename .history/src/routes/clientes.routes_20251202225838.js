// src/routes/cliente.routes.js
import { Router } from "express";
import { clienteController } from "../controllers/cliente.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// Todas las rutas de clientes requieren usuario autenticado y ADMIN
router.use(authMiddleware.requireAuth);
router.use(authMiddleware.requireAdmin);

// LISTAR CLIENTES (para la tabla del admin)
router.get("/", clienteController.list);

// OBTENER CLIENTE POR ID
router.get("/:id", clienteController.getById);

// CREAR CLIENTE DESDE ADMIN
router.post("/", clienteController.createFromAdmin);

// ACTUALIZAR CLIENTE (el modal usa PUT)
router.put("/:id", clienteController.updateFromAdmin);

// PATCH opcional (por si algún día lo necesitas)
router.patch("/:id", clienteController.updateFromAdmin);

// ELIMINAR CLIENTE
router.delete("/:id", clienteController.remove);

export default router;
