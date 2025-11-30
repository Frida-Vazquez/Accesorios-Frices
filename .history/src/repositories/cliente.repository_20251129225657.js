// repositories/cliente.repository.js
import { pool } from "../utils/db.js""; // o como se llame tu conexión

export const clienteRepository = {
  // ya lo tienes
  async findByEmail(email) {
    const [rows] = await pool.query(
      "SELECT * FROM clientes WHERE email = ?",
      [email]
    );
    return rows[0] || null;
  },

  // NUEVO: crear cliente
  async create({ nombre, email, password_hash }) {
    const [result] = await pool.query(
      `INSERT INTO clientes (nombre, email, password_hash, activo)
       VALUES (?, ?, ?, 1)`,
      [nombre, email, password_hash]
    );

    return {
      id: result.insertId,
      nombre,
      email,
      password_hash,
      activo: 1,
    };
  },

  // NUEVO: asignar rol por nombre (CLIENTE / ADMIN)
  async addRoleToCliente(clienteId, rolNombre) {
    // 1) obtener id del rol
    const [roles] = await pool.query(
      "SELECT id FROM roles WHERE nombre = ?",
      [rolNombre]
    );
    if (roles.length === 0) return;

    const rolId = roles[0].id;

    // 2) insertar en cliente_roles (si no existe)
    await pool.query(
      `INSERT IGNORE INTO cliente_roles (cliente_id, rol_id)
       VALUES (?, ?)`,
      [clienteId, rolId]
    );
  },

  // ya lo tienes
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
