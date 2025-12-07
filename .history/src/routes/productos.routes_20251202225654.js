// src/routes/productos.routes.js
import { Router } from "express";

import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/producto.controller.js";

// Importa lo que realmente existe en tu proyecto
import { requireAuth, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// =============================
// TODAS LAS RUTAS SON SOLO ADMIN
// =============================
router.use(requireAuth);
router.use(requireAdmin);

// LISTAR PRODUCTOS
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
