// src/repositories/cliente.repository.js
import { pool } from "../utils/db.js";

// Todas las operaciones sobre la tabla "clientes"
export const clienteRepository = {
  // Buscar por email (lo usa el login)
  async findByEmail(email) {
    const [rows] = await pool.query(
      "SELECT * FROM clientes WHERE email = ?",
      [email]
    );
    return rows[0] || null;
  },

  // Crear cliente (lo usa el registro)
  async create({ nombre, email, password_hash }) {
    const [result] = await pool.query(
      `INSERT INTO clientes (nombre, email, password_hash, activo, created_at, updated_at)
       VALUES (?, ?, ?, 1, NOW(), NOW())`,
      [nombre, email, password_hash]
    );

    const [rows] = await pool.query(
      "SELECT * FROM clientes WHERE id = ?",
      [result.insertId]
    );
    return rows[0] || null;
  },

  // ====== ADMIN: listar todos los clientes ======
  async findAll() {
    const [rows] = await pool.query(
      `SELECT id, nombre, email, activo, created_at
       FROM clientes
       ORDER BY id ASC`
    );
    return rows;
  },

  // Buscar cliente por ID
  async findById(id) {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, activo, created_at FROM clientes WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  // Actualizar datos desde el panel admin
  async updateFromAdmin(id, { nombre, email, password_hash, activo }) {
    // Si viene password_hash -> también actualizamos la contraseña
    if (password_hash) {
      await pool.query(
        `UPDATE clientes
         SET nombre = ?, email = ?, password_hash = ?, activo = ?, updated_at = NOW()
         WHERE id = ?`,
        [nombre, email, password_hash, activo ? 1 : 0, id]
      );
    } else {
      await pool.query(
        `UPDATE clientes
         SET nombre = ?, email = ?, activo = ?, updated_at = NOW()
         WHERE id = ?`,
        [nombre, email, activo ? 1 : 0, id]
      );
    }

    const [rows] = await pool.query(
      "SELECT id, nombre, email, activo, created_at FROM clientes WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  // Eliminar cliente
  async remove(id) {
    await pool.query("DELETE FROM clientes WHERE id = ?", [id]);
  },

  // Roles de un cliente (para saber si es ADMIN, CLIENTE, etc.)
  async findRolesByClienteId(clienteId) {
    const [rows] = await pool.query(
      `SELECT r.nombre
       FROM roles r
       INNER JOIN cliente_roles cr ON cr.rol_id = r.id
       WHERE cr.cliente_id = ?`,
      [clienteId]
    );

    return rows.map((r) => r.nombre);
  },
};
