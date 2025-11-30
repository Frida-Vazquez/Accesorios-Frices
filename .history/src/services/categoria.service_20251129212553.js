// services/categoria.service.js
// Lógica de negocio para categorías (Accesorios Frices)

import { categoriaRepository } from "../repositories/categoria.repository.js";

export const categoriaService = {
  /**
   * Listar todas las categorías
   */
  async listar() {
    return categoriaRepository.findAll();
  },

  /**
   * Obtener categoría por ID
   */
  async obtener(id) {
    const cat = await categoriaRepository.findById(id);
    if (!cat) {
      const err = new Error("Categoría no encontrada");
      err.status = 404;
      throw err;
    }
    return cat;
  },

  /**
   * Crear nueva categoría
   * (validación previa ocurre en el controller con Zod)
   */
  async crear(data) {
    return categoriaRepository.create(data);
  },

  /**
   * Actualizar categoría (PATCH)
   */
  async actualizar(id, data) {
    const updated = await categoriaRepository.update(id, data);

    if (!updated) {
      const err = new Error("Categoría no encontrada");
      err.status = 404;
      throw err;
    }

    return updated;
  },

  /**
   * Eliminar categoría
   */
  async eliminar(id) {
    const ok = await categoriaRepository.remove(id);

    if (!ok) {
      const err = new Error("Categoría no encontrada");
      err.status = 404;
      throw err;
    }
  },
};
