// src/repositories/categoria.repository.js
import { pool } from "../utils/db.js";

export const categoriaRepository = {
  async findAll() {
    const [rows] = await pool.query(
      `SELECT
         id,
         nombre,
         descripcion,
         activa,
         imagen_url,          -- 👈 NUEVO
         created_at,
         updated_at
       FROM categorias
       ORDER BY id ASC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT
         id,
         nombre,
         descripcion,
         activa,
         imagen_url,          -- 👈 NUEVO
         created_at,
         updated_at
       FROM categorias
       WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ nombre, descripcion, activa = 1, imagen_url = null }) {
    const [result] = await pool.query(
      `INSERT INTO categorias (nombre, descripcion, activa, imagen_url)
       VALUES (?, ?, ?, ?)`,
      [
        nombre,
        descripcion ?? null,
        activa ? 1 : 0,
        imagen_url ?? null,   // 👈 NUEVO
      ]
    );

    return this.findById(result.insertId);
  },

  async update(id, { nombre, descripcion, activa, imagen_url = null }) {
    const [result] = await pool.query(
      `UPDATE categorias
       SET
         nombre      = IFNULL(?, nombre),
         descripcion = IFNULL(?, descripcion),
         activa      = IFNULL(?, activa),
         imagen_url  = IFNULL(?, imagen_url)  -- 👈 NUEVO
       WHERE id = ?`,
      [
        nombre ?? null,
        descripcion ?? null,
        activa !== undefined ? (activa ? 1 : 0) : null,
        imagen_url ?? null,
        id,
      ]
    );

    if (result.affectedRows === 0) return null;
    return this.findById(id);
  },

  async remove(id) {
    const [result] = await pool.query(
      `DELETE FROM categorias WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  },
};
