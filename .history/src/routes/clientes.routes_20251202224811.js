// src/routes/cliente.routes.js
import { Router } from "express";
import { clienteController } from "../controllers/cliente.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

import { authRequired, requireRole } from "../middlewares/authMiddleware.js";
const router = Router();

// Todas las rutas de clientes sólo ADMIN
router.use(authMiddleware.requireAdmin);
// GET /api/clientes/:id
router.get("/:id", authRequired, requireRole("ADMIN"), obtenerCliente);

// POST /api/clientes
router.post("/", authRequired, requireRole("ADMIN"), crearCliente);

// PUT /api/clientes/:id  🔹 para el admin.js
router.put("/:id", authRequired, requireRole("ADMIN"), actualizarCliente);

// PATCH /api/clientes/:id (opcional, por si lo usas en otro lado)
router.patch("/:id", authRequired, requireRole("ADMIN"), actualizarCliente);

// DELETE /api/clientes/:id
router.delete("/:id", authRequired, requireRole("ADMIN"), eliminarCliente);

export default router;
