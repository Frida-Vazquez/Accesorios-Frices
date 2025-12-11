// src/repositories/pedido.repository.js
import { pool } from "../db/connection.js";

export const pedidoRepository = {
  async listar() {
    const [rows] = await pool.query(
      `
      SELECT 
        p.id,
        p.created_at AS fecha,          -- 👈 usamos created_at como fecha
        p.estado,
        p.total,
        c.nombre AS cliente_nombre,
        c.email AS cliente_email
      FROM pedidos p
      JOIN clientes c ON c.id = p.cliente_id
      ORDER BY p.created_at DESC
      `
    );
    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      `
      SELECT 
        p.id,
        p.created_at AS fecha,
        p.estado,
        p.total,
        c.nombre AS cliente_nombre,
        c.email AS cliente_email
      FROM pedidos p
      JOIN clientes c ON c.id = p.cliente_id
      WHERE p.id = ?
      `,
      [id]
    );
    return rows[0] || null;
  },
};
