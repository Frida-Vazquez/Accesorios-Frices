// repositories/categoria.repository.js
// Accesorios Frices - Repositorio de categorías
// Trabaja contra la tabla `categorias` de la BD AccesoriosFrices

import { pool } from "../utils/db.js";

export const categoriaRepository = {
  // Obtener todas las categorías
  async findAll() {
    const [rows] = await pool.query(
      `SELECT
          id,
          nombre,
          descripcion,
          activa,
          created_at AS createdAt,
          updated_at AS updatedAt
       FROM categorias
       ORDER BY nombre ASC`
    );
    return rows;
  },

  // Buscar categoría por ID
  async findById(id) {
    const [rows] = await pool.query(
      `SELECT
          id,
          nombre,
          descripcion,
          activa,
          created_at AS createdAt,
          updated_at AS updatedAt
       FROM categorias
       WHERE id = ?`,
      [id]
    );
    return rows[0] ?? null;
  },

  // Crear nueva categoría
  async create({ nombre, descripcion, activa = true }) {
    const [result] = await pool.query(
      `INSERT INTO categorias (nombre, descripcion, activa)
       VALUES (?, ?, ?)`,
      [
        nombre,
        descripcion ?? null,
        activa ? 1 : 0, // boolean → TINYINT(1)
      ]
    );
    return this.findById(result.insertId);
  },

  // Actualizar categoría (patch dinámico)
  async update(id, data) {
    const fields = [];
    const values = [];

    if (data.nombre !== undefined) {
      fields.push("nombre = ?");
      values.push(data.nombre);
    }

    if (data.descripcion !== undefined) {
      fields.push("descripcion = ?");
      values.push(data.descripcion);
    }

    if (data.activa !== undefined) {
      fields.push("activa = ?");
      values.push(data.activa ? 1 : 0);
    }

    // Si no se mandó nada para actualizar, regresamos la categoría tal cual
    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const [result] = await pool.query(
      `UPDATE categorias
       SET ${fields.join(", ")}
       WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) return null;
    return this.findById(id);
  },

  // Eliminar categoría
  async remove(id) {
    const [result] = await pool.query(
      `DELETE FROM categorias WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  },
};
