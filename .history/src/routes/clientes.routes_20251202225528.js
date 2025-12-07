// src/routes/cliente.routes.js
import { Router } from "express";
import { clienteController } from "../controllers/cliente.controller.js";

// Importar SOLO lo que realmente existe en tu proyecto
import { requireAuth, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// =============================
// TODAS LAS RUTAS SON SOLO ADMIN
// =============================
router.use(requireAuth);
router.use(requireAdmin);

// LISTAR CLIENTES
router.get("/", clienteController.list);

// OBTENER CLIENTE POR ID
router.get("/:id", clienteController.getById);

// CREAR CLIENTE
router.post("/", clienteController.createFromAdmin);

// ACTUALIZAR CLIENTE (modal usa PUT)
router.put("/:id", clienteController.updateFromAdmin);

// PATCH opcional
router.patch("/:id", clienteController.updateFromAdmin);

// ELIMINAR CLIENTE
router.delete("/:id", clienteController.remove);

export default router;
