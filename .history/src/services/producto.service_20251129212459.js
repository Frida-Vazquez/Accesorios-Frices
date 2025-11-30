// services/producto.service.js
// Lógica de negocio para productos de Accesorios Frices

import { productoRepository } from "../repositories/producto.repository.js";

export const productoService = {
  /**
   * Listar productos con filtros (ej: categoriaId)
   */
  async listar(filtros = {}) {
    return productoRepository.findAll(filtros);
  },

  /**
   * Obtener un producto por ID
   */
  async obtener(id) {
    const p = await productoRepository.findById(id);
    if (!p) {
      const err = new Error("Producto no encontrado");
      err.status = 404;
      throw err;
    }
    return p;
  },

  /**
   * Crear un nuevo producto
   * El schema Zod ya valida los datos desde el controller
   */
  async crear(data) {
    try {
      return await productoRepository.create(data);
    } catch (e) {
      // Aquí podríamos agregar validaciones adicionales si quisieras
      throw e;
    }
  },

  /**
   * Actualizar producto (PATCH)
   */
  async actualizar(id, data) {
    const updated = await productoRepository.update(id, data);
    if (!updated) {
      const err = new Error("Producto no encontrado");
      err.status = 404;
      throw err;
    }
    return updated;
  },

  /**
   * Eliminar producto
   */
  async eliminar(id) {
    const ok = await productoRepository.remove(id);
    if (!ok) {
      const err = new Error("Producto no encontrado");
      err.status = 404;
      throw err;
    }
  },
};
