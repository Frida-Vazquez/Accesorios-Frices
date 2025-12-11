// src/repositories/carrito.repository.js
import { pool } from "../utils/db.js";

export const carritoRepository = {
  // Obtener o crear el carrito ACTIVO del cliente
  async getOrCreateCarritoActivo(clienteId) {
    const [rows] = await pool.query(
      `SELECT id
       FROM carritos
       WHERE cliente_id = ? AND estado = 'ACTIVO'
       LIMIT 1`,
      [clienteId]
    );

    if (rows.length > 0) {
      return rows[0].id;
    }

    const [result] = await pool.query(
      `INSERT INTO carritos (cliente_id, estado, created_at, updated_at)
       VALUES (?, 'ACTIVO', NOW(), NOW())`,
      [clienteId]
    );

    return result.insertId;
  },

  // Agregar o sumar un item al carrito
  async addOrUpdateItem(clienteId, productoId, cantidad, precioUnitario) {
    const carritoId = await this.getOrCreateCarritoActivo(clienteId);

    await pool.query(
      `INSERT INTO carrito_items (carrito_id, producto_id, cantidad, precio_unitario, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE
         cantidad = cantidad + VALUES(cantidad),
         updated_at = NOW()`,
      [carritoId, productoId, cantidad, precioUnitario]
    );

    return this.getCarritoCompleto(clienteId);
  },

  // Cambiar cantidad de un item
  async setCantidadItem(clienteId, productoId, cantidad) {
    const carritoId = await this.getOrCreateCarritoActivo(clienteId);

    if (cantidad <= 0) {
      await pool.query(
        `DELETE FROM carrito_items
         WHERE carrito_id = ? AND producto_id = ?`,
        [carritoId, productoId]
      );
      return this.getCarritoCompleto(clienteId);
    }

    await pool.query(
      `UPDATE carrito_items
       SET cantidad = ?, updated_at = NOW()
       WHERE carrito_id = ? AND producto_id = ?`,
      [cantidad, carritoId, productoId]
    );

    return this.getCarritoCompleto(clienteId);
  },

  async removeItem(clienteId, productoId) {
    const carritoId = await this.getOrCreateCarritoActivo(clienteId);

    await pool.query(
      `DELETE FROM carrito_items
       WHERE carrito_id = ? AND producto_id = ?`,
      [carritoId, productoId]
    );

    return this.getCarritoCompleto(clienteId);
  },

  async clear(clienteId) {
    const carritoId = await this.getOrCreateCarritoActivo(clienteId);

    await pool.query(
      `DELETE FROM carrito_items
       WHERE carrito_id = ?`,
      [carritoId]
    );

    return this.getCarritoCompleto(clienteId);
  },

  async getCarritoCompleto(clienteId) {
    const [rows] = await pool.query(
      `SELECT
         ci.producto_id      AS productoId,
         p.nombre            AS nombre,
         p.descripcion       AS descripcion,
         p.url_imagen        AS urlImagen,
         p.stock             AS stockDisponible,
         ci.cantidad         AS cantidad,
         ci.precio_unitario  AS precioUnitario,
         (ci.cantidad * ci.precio_unitario) AS subtotal
       FROM carrito_items ci
       INNER JOIN carritos c ON c.id = ci.carrito_id
       INNER JOIN productos p ON p.id = ci.producto_id
       WHERE c.cliente_id = ? AND c.estado = 'ACTIVO'
       ORDER BY ci.id ASC`,
      [clienteId]
    );

    const total = rows.reduce(
      (acc, item) => acc + Number(item.subtotal || 0),
      0
    );

    return {
      items: rows,
      total,
    };
  },

  // ================== CHECKOUT: crear pedido desde carrito ==================
  async checkoutDesdeCarritoActivo(clienteId) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // 1) Buscar carrito ACTIVO
      const [carritos] = await conn.query(
        `SELECT id
         FROM carritos
         WHERE cliente_id = ? AND estado = 'ACTIVO'
         FOR UPDATE`,
        [clienteId]
      );

      if (!carritos.length) {
        throw new Error("No hay carrito activo para este cliente.");
      }

      const carritoId = carritos[0].id;

      // 2) Items del carrito + stock de productos
      const [items] = await conn.query(
        `SELECT
           ci.producto_id,
           ci.cantidad,
           ci.precio_unitario,
           (ci.cantidad * ci.precio_unitario) AS subtotal,
           p.stock
         FROM carrito_items ci
         JOIN productos p ON p.id = ci.producto_id
         WHERE ci.carrito_id = ?
         FOR UPDATE`,
        [carritoId]
      );

      if (!items.length) {
        throw new Error("El carrito está vacío.");
      }

      // 3) Total
      const total = items.reduce(
        (acc, it) => acc + Number(it.subtotal || 0),
        0
      );

      // 4) Insertar en PEDIDOS
      const [pedidoRes] = await conn.query(
        `INSERT INTO pedidos (cliente_id, total, estado, created_at, updated_at)
         VALUES (?, ?, 'PENDIENTE', NOW(), NOW())`,
        [clienteId, total]
      );
      const pedidoId = pedidoRes.insertId;

      // 5) Insertar en PEDIDO_ITEMS
      const values = items.map((it) => [
        pedidoId,
        it.producto_id,
        it.cantidad,
        it.precio_unitario,
        it.subtotal,
        new Date(),
        new Date(),
      ]);

      await conn.query(
        `INSERT INTO pedido_items
           (pedido_id, producto_id, cantidad, precio_unitario, subtotal, created_at, updated_at)
         VALUES ?`,
        [values]
      );

      // 6) Actualizar stock de cada producto
      for (const it of items) {
        const nuevoStock = it.stock - it.cantidad;
        if (nuevoStock < 0) {
          throw new Error("Stock insuficiente para uno de los productos.");
        }

        await conn.query(
          `UPDATE productos
           SET stock = ?
           WHERE id = ?`,
          [nuevoStock, it.producto_id]
        );
      }

      // 7) Marcar carrito como COMPLETADO y limpiar items
      await conn.query(
        `UPDATE carritos
         SET estado = 'COMPLETADO', updated_at = NOW()
         WHERE id = ?`,
        [carritoId]
      );

      await conn.query(
        `DELETE FROM carrito_items
         WHERE carrito_id = ?`,
        [carritoId]
      );

      await conn.commit();
      conn.release();

      return { pedidoId, total };
    } catch (err) {
      await conn.rollback();
      conn.release();
      throw err;
    }
  },
};
