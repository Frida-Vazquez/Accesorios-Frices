// routes/productos.routes.js
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

// Públicos: listar y ver detalle
router.get("/", listarProductos);
router.get("/:id", obtenerProducto);

// Solo ADMIN puede crear, actualizar o eliminar productos
router.post("/", authRequired, requireRole("ADMIN"), crearProducto);
router.patch("/:id", authRequired, requireRole("ADMIN"), actualizarProducto);
router.delete("/:id", authRequired, requireRole("ADMIN"), eliminarProducto);

export default router;
