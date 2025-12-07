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

// Todas las rutas de productos requieren usuario autenticado y ADMIN
router.use(authMiddleware.requireAuth);
router.use(authMiddleware.requireAdmin);

// LISTAR PRODUCTOS (para la pestaña Productos del admin)
router.get("/", listarProductos);

// OBTENER PRODUCTO POR ID
router.get("/:id", obtenerProducto);

// CREAR PRODUCTO
router.post("/", crearProducto);

// ACTUALIZAR PRODUCTO (el admin usa PUT)
router.put("/:id", actualizarProducto);

// PATCH opcional
router.patch("/:id", actualizarProducto);

// ELIMINAR PRODUCTO
router.delete("/:id", eliminarProducto);

export default router;
