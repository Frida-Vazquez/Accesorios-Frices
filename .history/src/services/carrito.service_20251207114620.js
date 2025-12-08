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
}

};
