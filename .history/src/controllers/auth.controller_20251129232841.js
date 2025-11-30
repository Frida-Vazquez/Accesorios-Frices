// src/controllers/auth.controller.js

import jwt from "jsonwebtoken";
import { LoginSchema } from "../models/auth.model.js";
import { authService } from "../services/auth.service.js";

const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
  throw new Error("Falta JWT_SECRET en variables de entorno (JWT_SECRET)");
}

/**
 * ==========================================
 * LOGIN
 * ==========================================
 */
export const login = async (req, res, next) => {
  try {
    // Valida el body con Zod (email, password)
    const payload = LoginSchema.parse(req.body);

    // authService.login devuelve { token, user }
    const result = await authService.login(payload);

    return res.json({
      ok: true,
      ...result,
    });
  } catch (e) {
    next(e);
  }
};

/**
 * ==========================================
 * REGISTER (registro público de clientes)
 * ==========================================
 */
export const register = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    // Validación básica (si quieres luego hacemos un RegisterSchema)
    if (!nombre || !email || !password) {
      return res
        .status(400)
        .json({ message: "Nombre, email y password son obligatorios" });
    }

    const user = await authService.register({ nombre, email, password });

    return res.status(201).json({
      ok: true,
      message: "Usuario registrado correctamente",
      user,
    });
  } catch (e) {
    next(e);
  }
};

/**
 * ==========================================
 * VALIDATE TOKEN (opcional, para frontend)
 * GET /api/auth/validate con header Authorization: Bearer <token>
 * ==========================================
 */
export const validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Token no proporcionado", ok: false });
    }

    // Decodificar y verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    // decoded tendrá { sub, email, roles, iat, exp }

    return res.json({
      ok: true,
      user: {
        id: decoded.sub,
        email: decoded.email,
        roles: decoded.roles,
      },
    });
  } catch (e) {
    // Errores típicos de JWT
    if (e.name === "JsonWebTokenError" || e.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ ok: false, message: "Token inválido o expirado" });
    }
    next(e);
  }
};
