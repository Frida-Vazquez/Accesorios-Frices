// src/repositories/direEnvi.repository.js
import { pool } from "../utils/db.js";

export const direEnviRepository = {
  async crearDireccion(clienteId, datos) {
    const {
      nombre,
      telefono,
      calle,
      colonia,
      ciudad,
      estado,
      cp,
      referencias = null
    } = datos;

    const [result] = await pool.query(
      `
      INSERT INTO direcciones_envio
      (cliente_id, nombre, telefono, calle, colonia, ciudad, estado, cp, referencias, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
      [
        clienteId,
        nombre,
        telefono,
        calle,
        colonia,
        ciudad,
        estado,
        cp,
        referencias
      ]
    );

    return result.insertId;
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      `SELECT * FROM direcciones_envio WHERE id = ? LIMIT 1`,
      [id]
    );

    return rows[0] || null;
  }
};
