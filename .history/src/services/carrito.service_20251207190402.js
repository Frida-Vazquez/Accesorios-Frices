// src/services/carrito.service.js
import { carritoRepository } from "../repositories/carrito.repository.js";
import {
  CarritoAddItemSchema,
  CarritoUpdateItemSchema,
} from "../models/carrito.model.js";
import { productoRepository } from "../repositories/producto.repository.js";
import { pool } from "../utils/db.js";


export const carritoService = {
  async obtenerCarrito(clienteId) {
    return carritoRepository.getCarritoCompleto(clienteId);
  },

  // =========================
  // AGREGAR ITEM (respeta stock)
  // =========================
  async agregarItem(clienteId, data) {
    const { productoId, cantidad } = CarritoAddItemSchema.parse(data);

    const producto = await productoRepository.findById(productoId);
    if (!producto || !producto.activo) {
      const err = new Error("Producto no disponible");
      err.status = 404;
      throw err;
    }

    const stock = Number(producto.stock || 0);
    if (stock <= 0) {
      const err = new Error("Este producto está agotado.");
      err.status = 400;
      throw err;
    }

    // 👇 Revisar cuánto ya hay en el carrito
    const carritoActual = await carritoRepository.getCarritoCompleto(clienteId);
    const itemActual = carritoActual.items.find(
      (i) => i.productoId === productoId
    );
    const cantidadActual = itemActual ? Number(itemActual.cantidad || 0) : 0;
    const cantidadTotal = cantidadActual + cantidad;

    if (cantidadTotal > stock) {
      const err = new Error(
        `Solo hay ${stock} piezas disponibles de este producto.`
      );
      err.status = 400;
      throw err;
    }

    const precioUnitario = Number(producto.precio || 0);
    return carritoRepository.addOrUpdateItem(
      clienteId,
      productoId,
      cantidad,
      precioUnitario
    );
  },

  // =========================
  // ACTUALIZAR CANTIDAD (+ / -) (respeta stock)
  // =========================
  async actualizarCantidad(clienteId, data) {
    const { productoId, cantidad } = CarritoUpdateItemSchema.parse(data);

    const producto = await productoRepository.findById(productoId);
    if (!producto || !producto.activo) {
      const err = new Error("Producto no disponible");
      err.status = 404;
      throw err;
    }

    const stock = Number(producto.stock || 0);

    // si la cantidad es 0 o menos, la función del repo ya borra el item
    if (cantidad > stock) {
      const err = new Error(
        `Solo hay ${stock} piezas disponibles de este producto.`
      );
      err.status = 400;
      throw err;
    }

    return carritoRepository.setCantidadItem(clienteId, productoId, cantidad);
  },

  // =========================
  // ELIMINAR ITEM
  // =========================
  async eliminarItem(clienteId, productoId) {
    return carritoRepository.removeItem(clienteId, productoId);
  },

  // =========================
  // VACIAR CARRITO
  // =========================
  async vaciar(clienteId) {
    return carritoRepository.clear(clienteId);
  },

  // =========================
  // CHECKOUT (demo)
  // =========================
  // =========================
// CHECKOUT (demo con descuento de stock)
// =========================
async checkout(clienteId) {
  // 1) Obtener carrito actual
  const carrito = await carritoRepository.getCarritoCompleto(clienteId);
  if (!carrito.items.length) {
    const err = new Error("El carrito está vacío");
    err.status = 400;
    throw err;
  }

  // 2) Descontar stock producto por producto
  for (const item of carrito.items) {
    const cantidad = Number(item.cantidad || 0);
    const productoId = item.productoId;

    // Intentar restar stock solo si hay suficiente
    const [result] = await pool.query(
      `UPDATE productos
       SET stock = stock - ?
       WHERE id = ? AND stock >= ?`,
      [cantidad, productoId, cantidad]
    );

    if (result.affectedRows === 0) {
      const err = new Error(
        `No hay stock suficiente para "${item.nombre}".`
      );
      err.status = 400;
      throw err;
    }
  }

  // 3) Vaciar carrito
  await carritoRepository.clear(clienteId);

  // 4) Regresar respuesta
  return {
    ok: true,
    message: "Compra registrada (demo).",
    totalPagado: carrito.total,
  };
}

};
