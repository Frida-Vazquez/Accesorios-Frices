// src/routes/clientes.routes.js
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

import {
  list,            // lista todos los clientes
  getById,         // obtiene un cliente por id
  create,          // crea cliente (admin)
  updateFromAdmin, // actualiza cliente (admin)
  remove,          // elimina cliente
} from "../controllers/cliente.controller.js";

const router = Router();

/**
 * TODAS LAS RUTAS DE CLIENTES SON SOLO PARA ADMIN
 * (no las usa el cliente normal, solo admin.js)
 */

// Listar clientes
router.get(
  "/",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  list
);

// Obtener cliente por ID
router.get(
  "/:id",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  getById
);

// Crear nuevo cliente
router.post(
  "/",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  create
);

// Actualizar cliente (lo que usa admin.js para editar)
router.put(
  "/:id",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  updateFromAdmin
);

// Eliminar cliente
router.delete(
  "/:id",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  remove
);

export default router;
