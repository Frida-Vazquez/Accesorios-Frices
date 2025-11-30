// routes/auth.routes.js
// Accesorios Frices – Rutas de autenticación

import { Router } from "express";
import {
  login,
  register,     // Registrar clientes desde el frontend
  validateToken, // Opcional: validar sesión
} from "../controllers/auth.controller.js";

const router = Router();

/**
 * ==========================================
 * Autenticación
 * ==========================================
 */

// Iniciar sesión (login)
router.post("/login", login);

// Registrar cliente (solo cliente normal, NO admin)
router.post("/register", register);

// Validar token (opcional, útil para frontend SPA)
router.get("/validate", validateToken);

export default router;
