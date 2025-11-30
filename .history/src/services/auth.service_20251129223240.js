// controllers/auth.controller.js
import { authService } from "../services/auth.service.js";

export async function register(req, res, next) {
  try {
    const { nombre, email, password } = req.body;
    const nuevo = await authService.register({ nombre, email, password });

    return res.status(201).json({
      ok: true,
      message: "Usuario registrado correctamente",
      user: nuevo,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return res.json(result);
  } catch (error) {
    next(error);
  }
}
