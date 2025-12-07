// src/repositories/cliente.repository.js
import { pool } from "../utils/db.js"; // usa tu helper de conexión

export const clienteRepository = {
  // LISTAR TODOS LOS CLIENTES (para el admin)
  async findAll() {
    const [rows] = await pool.query(
      `SELECT id, nombre, email, telefono, activo, created_at, updated_at
       FROM clientes
       ORDER BY id ASC`
    );
    return rows;
  },

  // OBTENER CLIENTE POR ID
  async findById(id) {
    const [rows] = await pool.query(
      `SELECT id, nombre, email, telefono, activo, created_at, updated_at
       FROM clientes
       WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // BUSCAR POR EMAIL (para login / registro)
  async findByEmail(email) {
    const [rows] = await pool.query(
      "SELECT * FROM clientes WHERE email = ?",
      [email]
    );
    return rows[0] || null;
  },

  // CREAR CLIENTE
  async create({ nombre, email, password_hash, telefono = null, activo = 1 }) {
    const [result] = await pool.query(
      `INSERT INTO clientes (nombre, email, password_hash, telefono, activo)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, email, password_hash, telefono, activo]
    );

    const insertedId = result.insertId;
    return this.findById(insertedId);
  },

  // ACTUALIZAR CLIENTE
  async update(id, data) {
    const fields = [];
    const params = [];

    if (data.nombre !== undefined) {
      fields.push("nombre = ?");
      params.push(data.nombre);
    }
    if (data.email !== undefined) {
      fields.push("email = ?");
      params.push(data.email);
    }
    if (data.password_hash !== undefined) {
      fields.push("password_hash = ?");
      params.push(data.password_hash);
    }
    if (data.telefono !== undefined) {
      fields.push("telefono = ?");
      params.push(data.telefono);
    }
    if (data.activo !== undefined) {
      fields.push("activo = ?");
      params.push(data.activo);
    }

    if (fields.length === 0) {
      // nada que actualizar
      return this.findById(id);
    }

    params.push(id);

    const [result] = await pool.query(
      `UPDATE clientes SET ${fields.join(", ")} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) return null;

    return this.findById(id);
  },

  // ELIMINAR CLIENTE
  async remove(id) {
    const [result] = await pool.query(
      `DELETE FROM clientes WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  },

  // OBTENER ROLES DEL CLIENTE (para el login / JWT)
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
