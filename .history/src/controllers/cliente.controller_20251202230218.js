// src/controllers/cliente.controller.js
import { clienteRepository } from "../repositories/cliente.repository.js";

export const clienteController = {
  // LISTAR TODOS LOS CLIENTES (para el admin)
  async list(_req, res, next) {
    try {
      const clientes = await clienteRepository.findAll();
      res.json({ data: clientes });
    } catch (err) {
      next(err);
    }
  },

  // OBTENER CLIENTE POR ID
  async getById(req, res, next) {
    try {
      const id = Number(req.params.id);
      const cliente = await clienteRepository.findById(id);

      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      res.json({ data: cliente });
    } catch (err) {
      next(err);
    }
  },

  // CREAR CLIENTE DESDE EL ADMIN
  async createFromAdmin(req, res, next) {
    try {
      const { nombre, email, password_hash, telefono, activo } = req.body;

      const nuevo = await clienteRepository.create({
        nombre,
        email,
        password_hash,
        telefono,
        activo,
      });

      res.status(201).json({ data: nuevo });
    } catch (err) {
      next(err);
    }
  },

  // EDITAR CLIENTE DESDE EL ADMIN
  async updateFromAdmin(req, res, next) {
    try {
      const id = Number(req.params.id);
      const { nombre, email, password_hash, telefono, activo } = req.body;

      // 🔹 AQUÍ ESTABA EL PROBLEMA:
      // antes llamabas clienteRepository.updateFromAdmin(...)
      // pero la función real se llama "update"
      const actualizado = await clienteRepository.update(id, {
        nombre,
        email,
        password_hash,
        telefono,
        activo,
      });

      if (!actualizado) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      res.json({ data: actualizado });
    } catch (err) {
      next(err);
    }
  },

  // ELIMINAR CLIENTE
  async remove(req, res, next) {
    try {
      const id = Number(req.params.id);
      const ok = await clienteRepository.remove(id);

      if (!ok) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
};
