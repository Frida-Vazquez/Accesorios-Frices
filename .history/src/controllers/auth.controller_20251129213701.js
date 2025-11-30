// controllers/auth.controller.js
import { authService } from "../services/auth.service.js";
import { clienteService } from "../services/cliente.service.js"; // para registro

// LOGIN
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login({ email, password });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// REGISTER (Clientes normales desde /registro en el front)
export const register = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    // Crear cliente por medio del servicio
    const cliente = await clienteService.crear({
      nombre,
      email,
      password,
      activo: true
    });

    res.status(201).json({
      message: "Cliente registrado correctamente",
      cliente
    });
  } catch (err) {
    next(err);
  }
};
