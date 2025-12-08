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
       p.stock             AS stockDisponible,       -- 👈 stock actual del producto
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

        const total = rows.reduce((acc, item) => acc + Number(item.subtotal || 0), 0);

        return {
            items: rows,
            total,
        };
    }

