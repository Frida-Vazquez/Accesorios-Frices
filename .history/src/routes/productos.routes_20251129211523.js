// routes/productos.routes.js
// Accesorios Frices – Rutas de productos (catálogo)

import { Router } from "express";
import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/producto.controller.js";
import { authRequired, requireRole } from "../middlewares/auth.js";

const router = Router();

/**
 * ==========================================
 * Rutas públicas (clientes y visitantes)
 * ==========================================
 */

// Listar productos (con ?categoriaId opcional)
router.get("/", listarProductos);

// Obtener un producto por ID
router.get("/:id", obtenerProducto);

/**
 * ==========================================
 * Rutas protegidas — SOLO ADMIN
 * ==========================================
 */

// Crear producto (ADMIN)
router.post("/", authRequired, requireRole("ADMIN"), crearProducto);

// Editar producto (ADMIN)
router.patch("/:id", authRequired, requireRole("ADMIN"), actualizarProducto);

// Eliminar producto (ADMIN)
router.delete("/:id", authRequired, requireRole("ADMIN"), eliminarProducto);

export default router;
