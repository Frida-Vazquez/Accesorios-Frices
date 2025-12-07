// src/routes/productos.routes.js
import { Router } from "express";
import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/producto.controller.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";
const router = Router();


// Listar productos
router.get("/", authRequired, requireRole("ADMIN"), listarProductos);

// Obtener producto por ID
router.get("/:id", authRequired, requireRole("ADMIN"), obtenerProducto);

// Crear producto
router.post("/", authRequired, requireRole("ADMIN"), crearProducto);

// Actualizar producto (el admin.js usa PUT)
router.put("/:id", authRequired, requireRole("ADMIN"), actualizarProducto);
router.patch("/:id", authRequired, requireRole("ADMIN"), actualizarProducto); // opcional

// Eliminar producto
router.delete("/:id", authRequired, requireRole("ADMIN"), eliminarProducto);

export default router;