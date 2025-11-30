// services/cliente.service.js
// Lógica de negocio para clientes de Accesorios Frices

import bcrypt from "bcryptjs";
import { clienteRepository } from "../repositories/cliente.repository.js";

export const clienteService = {
  /**
   * Listar clientes (puedes usar pagination después)
   */
  async listar(pagination = {}) {
    return clienteRepository.findAll(pagination);
  },

  /**
   * Obtener cliente por ID
   */
  async obtener(id) {
    const c = await clienteRepository.findById(id);
    if (!c) {
      const err = new Error("Cliente no encontrado");
      err.status = 404;
      throw err;
    }
    return c;
  },

  /**
   * Crear cliente (se usa en admin y también podría usarse en registro backend)
   * Recibe: { nombre, email, password, activo }
   */
  async crear({ nombre, email, password, activo }) {
    try {
      const passwordHash = await bcrypt.hash(password, 10);

      return await clienteRepository.create({
        nombre,
        email,
        passwordHash,          // el repo se encarga de mapear a password_hash
        activo: activo ?? true // por defecto activo = true
      });
    } catch (e) {
      // Error por email duplicado
      if (e?.code === "ER_DUP_ENTRY" || e?.errno === 1062) {
        const err = new Error("El email ya está registrado");
        err.status = 409;
        throw err;
      }
      throw e;
    }
  },

  /**
   * Actualizar cliente (nombre, email, password, activo)
   */
  async actualizar(id, { nombre, email, password, activo }) {
    try {
      const data = { nombre, email, activo };

      // Si viene password, la re-hasheamos
      if (password !== undefined) {
        data.passwordHash = await bcrypt.hash(password, 10);
      }

      const updated = await clienteRepository.update(id, data);

      if (!updated) {
        const err = new Error("Cliente no encontrado");
        err.status = 404;
        throw err;
      }

      return updated;
    } catch (e) {
      // email duplicado
      if (e?.code === "ER_DUP_ENTRY" || e?.errno === 1062) {
        const err = new Error("El email ya está registrado");
        err.status = 409;
        throw err;
      }
      throw e;
    }
  },

  /**
   * Eliminar cliente
   */
  async eliminar(id) {
    const ok = await clienteRepository.remove(id);
    if (!ok) {
      const err = new Error("Cliente no encontrado");
      err.status = 404;
      throw err;
    }
  },
};
