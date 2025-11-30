// src/repositories/categoria.repository.js
import { pool } from "../utils/db.js";

export const categoriaRepository = {
  async findAll() {
    const [rows] = await pool.query(
      `SELECT id, nombre, descripcion, activa, created_at, updated_at
       FROM categorias
       ORDER BY id ASC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT id, nombre, descripcion, activa, created_at, updated_at
       FROM categorias
       WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ nombre, descripcion, activa = 1 }) {
    const [result] = await pool.query(
      `INSERT INTO categorias (nombre, descripcion, activa)
       VALUES (?, ?, ?)`,
      [nombre, descripcion, activa ? 1 : 0]
    );

    return this.findById(result.insertId);
  },

  async update(id, { nombre, descripcion, activa }) {
    const [result] = await pool.query(
      `UPDATE categorias
       SET
         nombre = IFNULL(?, nombre),
         descripcion = IFNULL(?, descripcion),
         activa = IFNULL(?, activa)
       WHERE id = ?`,
      [
        nombre ?? null,
        descripcion ?? null,
        activa !== undefined ? (activa ? 1 : 0) : null,
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
