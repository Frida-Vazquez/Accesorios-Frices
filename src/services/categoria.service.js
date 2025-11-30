// src/services/categoria.service.js
import { categoriaRepository } from "../repositories/categoria.repository.js";

export const categoriaService = {
  async listar() {
    return categoriaRepository.findAll();
  },

  async obtener(id) {
    const cat = await categoriaRepository.findById(id);
    if (!cat) {
      const err = new Error("Categoría no encontrada");
      err.status = 404;
      throw err;
    }
    return cat;
  },

  async crear({ nombre, descripcion, activa }) {
    if (!nombre) {
      const err = new Error("El nombre de la categoría es obligatorio");
      err.status = 400;
      throw err;
    }

    try {
      return await categoriaRepository.create({ nombre, descripcion, activa });
    } catch (e) {
      if (e?.code === "ER_DUP_ENTRY" || e?.errno === 1062) {
        const err = new Error("Ya existe una categoría con ese nombre");
        err.status = 409;
        throw err;
      }
      throw e;
    }
  },

  async actualizar(id, { nombre, descripcion, activa }) {
    const updated = await categoriaRepository.update(id, {
      nombre,
      descripcion,
      activa,
    });
    if (!updated) {
      const err = new Error("Categoría no encontrada");
      err.status = 404;
      throw err;
    }
    return updated;
  },

  async eliminar(id) {
    const ok = await categoriaRepository.remove(id);
    if (!ok) {
      const err = new Error("Categoría no encontrada");
      err.status = 404;
      throw err;
    }
  },
};
