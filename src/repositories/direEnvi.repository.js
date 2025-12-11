// src/repositories/direEnvi.repository.js
import { pool } from "../utils/db.js";

export const direEnviRepository = {
  // Crear una dirección ligada a un pedido
  async crearParaPedido(pedidoId, clienteId, data) {
    const {
      nombre,
      telefono,
      calle,
      colonia,
      ciudad,
      estado,
      cp,
      referencias = null,
    } = data;

    const [res] = await pool.query(
      `
      INSERT INTO direcciones_envio
        (pedido_id, cliente_id, nombre, telefono, calle, colonia, ciudad, estado, cp, referencias, created_at, updated_at)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
      [
        pedidoId,
        clienteId,
        nombre,
        telefono,
        calle,
        colonia,
        ciudad,
        estado,
        cp,
        referencias,
      ]
    );

    return res.insertId;
  },

  // Obtener la dirección de envío asociada a un pedido
  async obtenerPorPedido(pedidoId) {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM direcciones_envio
      WHERE pedido_id = ?
      LIMIT 1
      `,
      [pedidoId]
    );

    return rows[0] || null;
  },
};
