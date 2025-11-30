// controllers/auth.controller.js
import { authService } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { clienteRepository } from "../repositories/cliente.repository.js";

const { JWT_SECRET } = process.env;

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

// REGISTER
export const register = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    const cliente = await clienteRepository.createFromRegister({
      nombre,
      email,
      password,
    });

    res.status(201).json({
      message: "Usuario registrado",
      cliente
    });
  } catch (err) {
    next(err);
  }
};

// VALIDAR TOKEN
export const validateToken = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ message: "Token requerido" });
    }

    const payload = jwt.verify(token, JWT_SECRET);

    res.json({
      valid: true,
      user: payload
    });
  } catch (err) {
    next(err);
  }
};
