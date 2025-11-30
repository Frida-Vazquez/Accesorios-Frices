// src/services/producto.service.js
import { productoRepository } from "../repositories/producto.repository.js";

export const productoService = {
  async listar() {
    return productoRepository.findAll();
  },

  async obtener(id) {
    const prod = await productoRepository.findById(id);
    if (!prod) {
      const err = new Error("Producto no encontrado");
      err.status = 404;
      throw err;
    }
    return prod;
  },

  async crear(data) {
    const { categoria_id, nombre, precio, stock } = data;

    if (!categoria_id || !nombre || precio === undefined || stock === undefined) {
      const err = new Error(
        "categoria_id, nombre, precio y stock son obligatorios"
      );
      err.status = 400;
      throw err;
    }

    return productoRepository.create(data);
  },

  async actualizar(id, data) {
    const updated = await productoRepository.update(id, data);
    if (!updated) {
      const err = new Error("Producto no encontrado");
      err.status = 404;
      throw err;
    }
    return updated;
  },

  async eliminar(id) {
    const ok = await productoRepository.remove(id);
    if (!ok) {
      const err = new Error("Producto no encontrado");
      err.status = 404;
      throw err;
    }
  },
};
