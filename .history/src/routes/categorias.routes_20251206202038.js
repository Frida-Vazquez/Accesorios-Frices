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
 * RUTAS PÚBLICAS (clientes)
 * ============================
 * Se usan en public/cliente/cliente.js
 */

// Listar todas las categorías (cliente)
router.get("/", listarCategorias);

// Obtener una categoría por ID (por si luego haces detalle)
router.get("/:id", obtenerCategoria);

/**
 * RUTAS PROTEGIDAS (ADMIN)
 * ============================
 * Se usan en el panel admin
 */

router.post(
  "/",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  crearCategoria
);

router.put(
  "/:id",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  actualizarCategoria
);

router.patch(
  "/:id",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  actualizarCategoria
);

router.delete(
  "/:id",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  eliminarCategoria
);

export default router;
