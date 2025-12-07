// src/repositories/cliente.repository.js
import { pool } from "../db/pool.js";
import bcrypt from "bcryptjs";

export const clienteRepository = {
  async findAll() {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, activo, created_at FROM clientes"
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, activo, created_at FROM clientes WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  async createFromAdmin({ nombre, email, password, activo }) {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO clientes (nombre, email, password_hash, activo) VALUES (?, ?, ?, ?)",
      [nombre, email, hash, activo ? 1 : 0]
    );
    return this.findById(result.insertId);
  },

  async updateFromAdmin(id, { nombre, email, password, activo }) {
    // si viene password, la actualizamos; si no, solo otros campos
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query(
        "UPDATE clientes SET nombre = ?, email = ?, password_hash = ?, activo = ? WHERE id = ?",
        [nombre, email, hash, activo ? 1 : 0, id]
      );
    } else {
      await pool.query(
        "UPDATE clientes SET nombre = ?, email = ?, activo = ? WHERE id = ?",
        [nombre, email, activo ? 1 : 0, id]
      );
    }
    return this.findById(id);
  },

  async remove(id) {
    await pool.query("DELETE FROM clientes WHERE id = ?", [id]);
  },
};
