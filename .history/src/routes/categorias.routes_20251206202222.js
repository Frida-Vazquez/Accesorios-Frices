// src/routes/categorias.routes.js
import { Router } from "express";
import path from "path";
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
 * Guardamos los archivos en: /public/uploads/categorias
 */

// Para poder usar __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// carpeta física donde se guardarán las imágenes
const uploadPath = path.join(__dirname, "..", "..", "public", "uploads", "categorias");

// Storage de multer
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
 * ============================
 * Se usan en public/cliente/cliente.js
 */

// Listar todas las categorías (cliente)
router.get("/", listarCategorias);

// Obtener una categoría por ID (por si luego haces detalle)
router.get("/:id", obtenerCategoria);

/**
 * RUTAS PROTEGIDAS (ADMIN)
 * ============================
 * Se usan en el panel admin
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
 * SUBIR IMAGEN DE CATEGORÍA (ADMIN)
 * ============================
 * URL final: POST /api/categorias/upload
 * El frontend debe mandar un FormData con el campo "imagen"
 */
router.post(
  "/upload",
  authMiddleware.requireAuth,
  authMiddleware.requireAdmin,
  upload.single("imagen"), // "imagen" debe coincidir con el nombre en formData.append("imagen", file)
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No se recibió archivo" });
    }

    // Esta es la URL pública para acceder a la imagen
    const url = `/static/uploads/categorias/${req.file.filename}`;

    return res.json({ url });
  }
);

export default router;
