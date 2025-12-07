// src/routes/productos.routes.js
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/producto.controller.js";

const router = Router();

/**
 * Rutas públicas (cliente)
 * =========================
 * Se usan en public/cliente.js para mostrar productos
 */

// Listar productos (público)
router.get("/", listarProductos);

// Obtener producto por ID (público, por si luego haces página detalle)
router.get("/:id", obtenerProducto);

/**
 * Rutas protegidas (ADMIN)
 * =========================
 * Se usan en public/admin.js
 */

// Crear producto
router.post(
  "/",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  crearProducto
);

// Actualizar producto
router.put(
  "/:id",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  actualizarProducto
);

// PATCH opcional
router.patch(
  "/:id",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  actualizarProducto
);

// Eliminar producto
router.delete(
  "/:id",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  eliminarProducto
);

export default router;
