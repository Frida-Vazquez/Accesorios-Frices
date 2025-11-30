// services/auth.service.js
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
   * Registro de clientes
   * @param {{ nombre: string, email: string, password: string }} param0
   * @returns {{ id: number, nombre: string, email: string }}
   */
  async register({ nombre, email, password }) {
    // 1) ¿Ya existe ese correo?
    const existente = await clienteRepository.findByEmail(email);
    if (existente) {
      const err = new Error("El email ya está registrado");
      err.status = 400;
      throw err;
    }

    // 2) Hashear contraseña
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    // 3) Crear cliente en la BD
    //    (asegúrate de tener este método en el repository)
    const nuevoCliente = await clienteRepository.create({
      nombre,
      email,
      password_hash: hash,
    });

    // 4) Asignar rol CLIENTE
    //    (otro método en el repository, ver ejemplo abajo)
    await clienteRepository.addRoleToCliente(nuevoCliente.id, "CLIENTE");

    return {
      id: nuevoCliente.id,
      nombre: nuevoCliente.nombre,
      email: nuevoCliente.email,
    };
  },

  /**
   * Login de clientes / admin
   * @param {{ email: string, password: string }} param0
   * @returns {{ token: string, user: { id: number, nombre: string, email: string, roles: string[] } }}
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

    // 3) Comparar contraseña (texto plano vs hash bcrypt)
    const ok = await bcrypt.compare(password, password_hash);
    if (!ok) {
      const err = new Error("Credenciales inválidas");
      err.status = 401;
      throw err;
    }

    // 4) Obtener roles del cliente (ADMIN / CLIENTE)
    let roles = await clienteRepository.findRolesByClienteId(id);
    if (!roles || roles.length === 0) {
      roles = ["CLIENTE"]; // fallback mínimo
    }

    // 5) Crear payload para el token
    const payload = { sub: id, email, roles };

    // 6) Firmar JWT
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN, // por defecto "1h"
    });

    // 7) Respuesta estándar para el frontend (app.js / admin.js)
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
