import { pool } from "../utils/db.js";

export const clienteRepository = {
  async findAll({ limit = 50, offset = 0 } = {}) {
    const [rows] = await pool.query(
      `SELECT id, nombre, email, activo, created_at AS createdAt, updated_at AS updatedAt
       FROM clientes
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [Number(limit), Number(offset)]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT id, nombre, email, activo, created_at AS createdAt, updated_at AS updatedAt
       FROM clientes WHERE id = ?`,
      [id]
    );
    return rows[0] ?? null;
  },

  async create({ nombre, email, passwordHash, activo = true }) {
    const [result] = await pool.query(
      `INSERT INTO clientes (nombre, email, password_hash, activo)
       VALUES (?, ?, ?, ?)`,
      [nombre, email, passwordHash, activo ? 1 : 0]
    );
    const [rows] = await pool.query(
      `SELECT id, nombre, email, activo, created_at AS createdAt, updated_at AS updatedAt
       FROM clientes WHERE id = ?`,
      [result.insertId]
    );
    return rows[0];
  },

  async update(id, data) {
    const fields = [];
    const values = [];

    if (data.nombre !== undefined) {
      fields.push("nombre = ?");
      values.push(data.nombre);
    }
    if (data.email !== undefined) {
      fields.push("email = ?");
      values.push(data.email);
    }
    if (data.passwordHash !== undefined) {
      fields.push("password_hash = ?");
      values.push(data.passwordHash);
    }
    if (data.activo !== undefined) {
      fields.push("activo = ?");
      values.push(data.activo ? 1 : 0);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const [result] = await pool.query(
      `UPDATE clientes SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    if (result.affectedRows === 0) return null;
    return this.findById(id);
  },

  async remove(id) {
    const [result] = await pool.query(`DELETE FROM clientes WHERE id = ?`, [
      id,
    ]);
    return result.affectedRows > 0;
  },

  // repositories/cliente.repository.js
  async findByEmail(email) {
    const [rows] = await pool.query(
      `SELECT id, nombre, email, password_hash, activo, created_at AS createdAt, updated_at AS updatedAt
     FROM clientes
     WHERE email = ?`,
      [email]
    );
    return rows[0] ?? null;
  },
};
