// src/services/carrito.service.js
import { carritoRepository } from "../repositories/carrito.repository.js";
import {
  CarritoAddItemSchema,
  CarritoUpdateItemSchema,
} from "../models/carrito.model.js";
import { productoRepository } from "../repositories/producto.repository.js";

export const carritoService = {
  async obtenerCarrito(clienteId) {
    return carritoRepository.getCarritoCompleto(clienteId);
  },

  async agregarItem(clienteId, data) {
    const { productoId, cantidad } = CarritoAddItemSchema.parse(data);

    const producto = await productoRepository.findById(productoId);
    if (!producto || !producto.activo) {
      const err = new Error("Producto no disponible");
      err.status = 404;
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

  async actualizarCantidad(clienteId, data) {
    const { productoId, cantidad } = CarritoUpdateItemSchema.parse(data);
    return carritoRepository.setCantidadItem(clienteId, productoId, cantidad);
  },

  async eliminarItem(clienteId, productoId) {
    return carritoRepository.removeItem(clienteId, productoId);
  },

  async vaciar(clienteId) {
    return carritoRepository.clear(clienteId);
  },

  // Checkout simplificado: solo vacía el carrito por ahora
  async checkout(clienteId) {
    // Aquí en el futuro puedes crear un pedido real, registrar pago, etc.
    const carrito = await carritoRepository.getCarritoCompleto(clienteId);
    if (!carrito.items.length) {
      const err = new Error("El carrito está vacío");
      err.status = 400;
      throw err;
    }

    await carritoRepository.clear(clienteId);

    return {
      ok: true,
      message: "Compra registrada (demo). En el futuro aquí irá el pago real.",
      totalPagado: carrito.total,
    };
  },
};
