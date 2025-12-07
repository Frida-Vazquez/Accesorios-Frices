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

import multer from "multer";
import path from "path";

// =========================
// CONFIGURACIÓN DE MULTER 📸
// =========================

// Carpeta donde se guardarán las imágenes físicas
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // carpeta final
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// Inicializar multer
const upload = multer({ storage });

const router = Router();

// =========================
// MIDDLEWARES
// =========================
router.use(authMiddleware.requireAuth);
router.use(authMiddleware.requireAdmin);

// =========================
// RUTAS
// =========================

// LISTAR PRODUCTOS
router.get("/", listarProductos);

// OBTENER PRODUCTO POR ID
router.get("/:id", obtenerProducto);

// CREAR PRODUCTO (con imagen)
router.post("/", upload.single("imagen"), crearProducto);

// ACTUALIZAR PRODUCTO (con imagen)
router.put("/:id", upload.single("imagen"), actualizarProducto);

// PATCH opcional (también con imagen)
router.patch("/:id", upload.single("imagen"), actualizarProducto);

// ELIMINAR PRODUCTO
router.delete("/:id", eliminarProducto);

export default router;
