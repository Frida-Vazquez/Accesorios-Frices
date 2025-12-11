// src/repositories/pedido.repository.js
import { pool } from "../utils/db.js";

export const pedidoRepository = {
  async listar() {
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

  // 🔹 NUEVO: crear pedido
  async crearPedido(clienteId, total, estado = "PAGADO") {
    const [result] = await pool.query(
      `
      INSERT INTO pedidos (cliente_id, total, estado, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
      `,
      [clienteId, total, estado]
    );
    return result.insertId;
  },

  // 🔹 NUEVO: agregar item al pedido
  async agregarItem(pedidoId, productoId, cantidad, precioUnitario) {
    const subtotal = cantidad * precioUnitario;
    await pool.query(
      `
      INSERT INTO pedido_items 
      (pedido_id, producto_id, cantidad, precio_unitario, subtotal, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `,
      [pedidoId, productoId, cantidad, precioUnitario, subtotal]
    );
  },

  // Obtener los items de un pedido (para detalle)
  async obtenerItemsPorPedido(pedidoId) {
    const [rows] = await pool.query(
      `
    SELECT
      pi.producto_id,
      p.nombre,
      p.url_imagen AS urlImagen,
      pi.cantidad,
      pi.precio_unitario,
      pi.subtotal
    FROM pedido_items pi
    JOIN productos p ON p.id = pi.producto_id
    WHERE pi.pedido_id = ?
    ORDER BY pi.id ASC
    `,
      [pedidoId]
    );

    return rows;
  },

};
