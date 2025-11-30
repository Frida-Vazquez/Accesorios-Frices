// src/services/auth.service.js
// Servicio de autenticación para Accesorios Frices

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { clienteRepository } from "../repositories/cliente.repository.js";

const { JWT_SECRET, JWT_EXPIRES_IN = "1h" } = process.env;

if (!JWT_SECRET) {
  throw new Error("Falta JWT_SECRET en variables de entorno (JWT_SECRET)");
}

export const authService = {
  /**
   * REGISTRO de cliente (público)
   */
  async register({ nombre, email, password }) {
    // 1) Verificar si ya existe el email
    const existente = await clienteRepository.findByEmail(email);
    if (existente) {
      const err = new Error("El email ya está registrado");
      err.status = 400;
      throw err;
    }

    // 2) Hashear contraseña
    const hash = await bcrypt.hash(password, 10);

    // 3) Crear cliente en la BD
    const nuevo = await clienteRepository.create({
      nombre,
      email,
      password_hash: hash,
    });

    // 4) (Opcional) asignar rol CLIENTE
    // si tienes clienteRepository.addRoleToCliente lo puedes usar:
    // await clienteRepository.addRoleToCliente(nuevo.id, "CLIENTE");

    return {
      id: nuevo.id,
      nombre: nuevo.nombre,
      email: nuevo.email,
    };
  },

  /**
   * LOGIN de clientes / admin
   */
  async login({ email, password }) {
    // 1) Buscar cliente por email
    const cliente = await clienteRepository.findByEmail(email);
    if (!cliente) {
      const err = new Error("Credenciales inválidas");
      err.status = 401;
      throw err;
    }

    const { id, password_hash, activo } = cliente;

    // 2) Verificar que la cuenta esté activa
    if (!activo) {
      const err = new Error("Tu cuenta está inactiva. Contacta con soporte.");
      err.status = 403;
      throw err;
    }

    // 3) Comparar contraseña
    const ok = await bcrypt.compare(password, password_hash);
    if (!ok) {
      const err = new Error("Credenciales inválidas");
      err.status = 401;
      throw err;
    }

    // 4) Obtener roles del cliente (puede ser que ya tengas esto implementado)
    let roles = [];
    if (typeof clienteRepository.findRolesByClienteId === "function") {
      roles = await clienteRepository.findRolesByClienteId(id);
    }
    if (!roles || roles.length === 0) roles = ["CLIENTE"];

    // 5) Crear token
    const payload = { sub: id, email, roles };
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return {
      token,
      user: {
        id,
        nombre: cliente.nombre,
        email: cliente.email,
        roles,
      },
    };
  },
};
