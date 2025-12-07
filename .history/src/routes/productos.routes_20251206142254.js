// src/routes/productos.routes.js
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import multer from "multer";
import path from "path";

// === CONFIGURACIÓN DE MULTER ===
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/producto.controller.js";

const router = Router();

// Rutas protegidas
router.use(authMiddleware.requireAuth);
router.use(authMiddleware.requireAdmin);

// LISTAR
router.get("/", listarProductos);

// OBTENER
router.get("/:id", obtenerProducto);

// CREAR (con imagen)
router.post("/", upload.single("imagen"), crearProducto);

// ACTUALIZAR (con imagen opcional)
router.put("/:id", upload.single("imagen"), actualizarProducto);
router.patch("/:id", upload.single("imagen"), actualizarProducto);

// ELIMINAR
router.delete("/:id", eliminarProducto);

export default router;
