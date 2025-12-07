// src/routes/productos.routes.js
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

// GET /api/productos
router.get("/", listarProductos);

// GET /api/productos/:id
router.get("/:id", obtenerProducto);

// POST /api/productos
router.post("/", crearProducto);

// PUT /api/productos/:id
router.put("/:id", actualizarProducto);

// DELETE /api/productos/:id
router.delete("/:id", eliminarProducto);

export default router;
