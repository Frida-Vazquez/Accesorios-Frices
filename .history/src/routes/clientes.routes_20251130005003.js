// src/routes/cliente.routes.js
import { Router } from "express";
import { clienteController } from "../controllers/cliente.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// Todas las rutas de clientes sólo ADMIN
router.use(authMiddleware.requireAdmin);

// GET /api/clientes
router.get("/", clienteController.list);

// GET /api/clientes/:id
router.get("/:id", clienteController.getById);

// POST /api/clientes
router.post("/", clienteController.createFromAdmin);

// PATCH /api/clientes/:id
router.patch("/:id", clienteController.updateFromAdmin);

// DELETE /api/clientes/:id
router.delete("/:id", clienteController.remove);

export default router;
