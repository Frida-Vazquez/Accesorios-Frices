// src/routes/clientes.routes.js
import { Router } from "express";
import {
  list,
  getById,
  createFromAdmin,
  updateFromAdmin,
  remove,
} from "../controllers/cliente.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// Todas estas rutas son solo para ADMIN
router.use(authMiddleware.requireAuth, authMiddleware.requireAdmin);

// GET /api/clientes
router.get("/", list);

// GET /api/clientes/:id
router.get("/:id", getById);

// POST /api/clientes
router.post("/", createFromAdmin);

// PUT/PATCH /api/clientes/:id
router.put("/:id", updateFromAdmin);
router.patch("/:id", updateFromAdmin);

// DELETE /api/clientes/:id
router.delete("/:id", remove);

export default router;
