// src/routes/categorias.routes.js
import { Router } from "express";
import {
  listarCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/categoria.controller.js";

const router = Router();

// GET /api/categorias
router.get("/", listarCategorias);

// GET /api/categorias/:id
router.get("/:id", obtenerCategoria);

// POST /api/categorias
router.post("/", crearCategoria);

// PUT /api/categorias/:id
router.put("/:id", actualizarCategoria);

// DELETE /api/categorias/:id
router.delete("/:id", eliminarCategoria);

export default router;
