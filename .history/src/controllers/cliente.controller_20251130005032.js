// src/controllers/cliente.controller.js
import { clienteRepository } from "../repositories/cliente.repository.js";

export const clienteController = {
  async list(req, res, next) {
    try {
      const rows = await clienteRepository.findAll();
      res.json({ data: rows });
    } catch (e) {
      next(e);
    }
  },

  async getById(req, res, next) {
    try {
      const id = Number(req.params.id);
      const cliente = await clienteRepository.findById(id);
      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }
      res.json({ data: cliente });
    } catch (e) {
      next(e);
    }
  },

  async createFromAdmin(req, res, next) {
    try {
      const nuevo = await clienteRepository.createFromAdmin(req.body);
      res.status(201).json({ data: nuevo });
    } catch (e) {
      next(e);
    }
  },

  async updateFromAdmin(req, res, next) {
    try {
      const id = Number(req.params.id);
      const actualizado = await clienteRepository.updateFromAdmin(id, req.body);
      res.json({ data: actualizado });
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      const id = Number(req.params.id);
      await clienteRepository.remove(id);
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  },
};
