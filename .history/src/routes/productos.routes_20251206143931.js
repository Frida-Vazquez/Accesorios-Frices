// src/routes/productos.routes.js
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import multer from "multer";

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

// Todas requieren login + admin
router.use(authMiddleware.requireAuth);
router.use(authMiddleware.requireAdmin);

// LISTAR
router.get("/", listarProductos);

// OBTENER
router.get("/:id", obtenerProducto);

// CREAR (con archivo "imagen")
router.post("/", upload.single("imagen"), crearProducto);

// ACTUALIZAR (con archivo opcional "imagen")
router.put("/:id", upload.single("imagen"), actualizarProducto);
router.patch("/:id", upload.single("imagen"), actualizarProducto);

// ELIMINAR
router.delete("/:id", eliminarProducto);

export default router;
