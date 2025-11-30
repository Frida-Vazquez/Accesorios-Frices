// routes/clientes.routes.js
// Accesorios Frices – Administración de clientes

import { Router } from "express";
import {
  listarClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from "../controllers/cliente.controller.js";
import { authRequired, requireRole } from "../middlewares/auth.js";

const router = Router();

/**
 * ==========================================
 * TODAS las rutas aquí son SOLO ADMIN
 * ==========================================
 * Esto asegura:
 * - El panel admin puede gestionar clientes
 * - Un cliente normal NO puede ver ni modificar otros clientes
 */
router.use(authRequired, requireRole("ADMIN"));

/**
 * ==========================================
 * CRUD de clientes
 * ==========================================
 */

// GET /api/clientes
router.get("/", listarClientes);

// GET /api/clientes/:id
router.get("/:id", obtenerCliente);

// POST /api/clientes
router.post("/", crearCliente);

// PATCH /api/clientes/:id
router.patch("/:id", actualizarCliente);

// DELETE /api/clientes/:id
router.delete("/:id", eliminarCliente);

export default router;
