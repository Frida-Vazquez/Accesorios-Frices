// src/routes/categorias.routes.js
import { Router } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import { authMiddleware } from "../middlewares/authMiddleware.js";

import {
  listarCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/categoria.controller.js";

const router = Router();

/**
 * CONFIGURACIÓN PARA SUBIR IMÁGENES DE CATEGORÍAS
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta física donde se guardarán las imágenes
const uploadPath = path.join(__dirname, "..", "..", "public", "uploads", "categorias");

// Si la carpeta no existe, la creamos
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📁 Carpeta creada para categorías:", uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, base + "-" + unique + ext);
  },
});

const upload = multer({ storage });

/**
 * RUTAS PÚBLICAS (clientes)
 */

router.get("/", listarCategorias);
router.get("/:id", obtenerCategoria);

/**
 * RUTAS PROTEGIDAS (ADMIN)
 */

router.post(
  "/",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  crearCategoria
);

router.put(
  "/:id",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  actualizarCategoria
);

router.patch(
  "/:id",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  actualizarCategoria
);

router.delete(
  "/:id",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  eliminarCategoria
);

/**
 * SUBIR IMAGEN DE CATEGORÍA
 * POST /api/categorias/upload
 * FormData con campo "imagen"
 */
router.post(
  "/upload",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  upload.single("imagen"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No se recibió archivo" });
    }

    const url = `/static/uploads/categorias/${req.file.filename}`;
    console.log("✅ Imagen de categoría subida:", url);
    return res.json({ url });
  }
);

export default router;
