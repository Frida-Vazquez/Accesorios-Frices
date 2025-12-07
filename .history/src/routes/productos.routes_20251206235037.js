// src/routes/productos.routes.js
import { Router } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import { authMiddleware } from "../middlewares/authMiddleware.js";

import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/producto.controller.js";

const router = Router();

/**
 * CONFIGURACIÓN PARA SUBIR IMÁGENES DE PRODUCTOS
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta física donde se guardarán las imágenes de productos
const uploadPath = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "uploads",
  "productos"
);

// Si la carpeta no existe, la creamos
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📁 Carpeta creada para productos:", uploadPath);
}

// Configuración de Multer para productos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);              // .jpg, .png
    const base = path.basename(file.originalname, ext);       // nombre sin ext
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${base}-${unique}${ext}`);
  },
});

const upload = multer({ storage });
router.get("/public", listarProductosPublico);
/**
 * RUTAS PROTEGIDAS (todas requieren ADMIN)
 */

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
