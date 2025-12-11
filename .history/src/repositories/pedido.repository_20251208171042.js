// src/repositories/pedido.repository.js
import { pool } from "../db/connection.js";

export const pedidoRepository = {
  async listar() {
    const [rows] = await pool.query(
      `
      SELECT 
        p.id,
        p.fecha_pedido AS fecha,      -- AJUSTA el nombre de la columna si es distinto
        p.estado,
        p.total,
        c.nombre AS cliente_nombre,
        c.email AS cliente_email
      FROM pedidos p
      JOIN clientes c ON c.id = p.cliente_id
      ORDER BY p.fecha_pedido DESC
      `
    );
    return rows;
  },

  // Si luego quieres ver detalle de un pedido:
  async obtenerPorId(id) {
    const [rows] = await pool.query(
      `
      SELECT 
        p.id,
        p.fecha_pedido AS fecha,
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
