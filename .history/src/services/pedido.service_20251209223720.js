// src/services/pedido.service.js
import { pedidoRepository } from "../repositories/pedido.repository.js";
import { carritoRepository } from "../repositories/carrito.repository.js";

export const pedidoService = {
  async listar() {
    return await pedidoRepository.listar();
  },

  async obtener(id) {
    const pedido = await pedidoRepository.obtenerPorId(id);
    if (!pedido) {
      const err = new Error("Pedido no encontrado");
      err.status = 404;
      throw err;
    }
    return pedido;
  },

  // 🔹 NUEVO: crear pedido a partir del carrito del cliente
  async crearDesdeCarrito(clienteId) {
    const carrito = await carritoRepository.obtenerCarritoConItems(clienteId);

    if (!carrito || carrito.items.length === 0) {
      const err = new Error("El carrito está vacío.");
      err.status = 400;
      throw err;
    }

    // calcular total
    const total = carrito.items.reduce(
      (acc, it) => acc + it.cantidad * it.precio_unitario,
      0
    );

    // crear pedido
    const pedidoId = await pedidoRepository.crearPedido(clienteId, total);

    // crear items del pedido
    for (const it of carrito.items) {
      await pedidoRepository.agregarItem(
        pedidoId,
        it.producto_id,
        it.cantidad,
        it.precio_unitario
      );
    }

    // marcar carrito como completado y vaciarlo
    await carritoRepository.completarCarrito(carrito.id);

    // devolver pedido completo para mostrar en el front
    const pedido = await pedidoRepository.obtenerPorId(pedidoId);
    return pedido;
  },
};
