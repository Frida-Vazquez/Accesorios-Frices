// src/services/pedido.service.js
import { pedidoRepository } from "../repositories/pedido.repository.js";
import { carritoRepository } from "../repositories/carrito.repository.js";

export const pedidoService = {
  // Listar todos los pedidos (para admin)
  async listar() {
    return await pedidoRepository.listar();
  },

  // Obtener UN pedido por ID, con sus items
  async obtener(id) {
    const pedido = await pedidoRepository.obtenerPorId(id);
    if (!pedido) {
      const err = new Error("Pedido no encontrado");
      err.status = 404;
      throw err;
    }

    // ⬇️ AQUÍ ES LO QUE FALTABA
    const items = await pedidoRepository.obtenerItemsPorPedido(id);

    // Devolvemos pedido + sus productos
    return { ...pedido, items };
  },

  // Crear pedido a partir del carrito del cliente
  async crearDesdeCarrito(clienteId) {
    // Usamos tu función que ya hace todo: crea pedido, items, descuenta stock,
    // marca el carrito como COMPLETADO, etc.
    const { pedidoId } = await carritoRepository.checkoutDesdeCarritoActivo(
      clienteId
    );

    // Volvemos a leer el pedido ya creado
    const pedido = await pedidoRepository.obtenerPorId(pedidoId);
    const items = await pedidoRepository.obtenerItemsPorPedido(pedidoId);

    return { ...pedido, items };
  },
};
