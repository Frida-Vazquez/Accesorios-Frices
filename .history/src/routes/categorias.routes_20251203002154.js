// src/routes/categorias.routes.js
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  listarCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/categoria.controller.js";

const router = Router();

/**
 * Rutas públicas (cliente)
 */

// Listar categorías
router.get("/", listarCategorias);

// Obtener categoría por ID (si llegas a usarla)
router.get("/:id", obtenerCategoria);

/**
 * Rutas protegidas (ADMIN)
 */

// Crear categoría
router.post(
  "/",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  crearCategoria
);

// Actualizar categoría
router.put(
  "/:id",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  actualizarCategoria
);

// Eliminar categoría
router.delete(
  "/:id",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  eliminarCategoria
);

export default router;
