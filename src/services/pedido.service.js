import { pedidoRepository } from "../repositories/pedido.repository.js";
import { carritoRepository } from "../repositories/carrito.repository.js";
import { direEnviRepository } from "../repositories/direEnvi.repository.js";

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

    const items = await pedidoRepository.obtenerItemsPorPedido(id);
    const direEnvi = await direEnviRepository.obtenerPorPedido(id);

    return { ...pedido, items, direEnvi };
  },

  async crearDesdeCarrito(clienteId, direEnviData) {
    const { pedidoId } = await carritoRepository.checkoutDesdeCarritoActivo(
      clienteId
    );

    await direEnviRepository.crearParaPedido(
      pedidoId,
      clienteId,
      direEnviData
    );

    const pedido = await pedidoRepository.obtenerPorId(pedidoId);
    const items = await pedidoRepository.obtenerItemsPorPedido(pedidoId);
    const direEnvi = await direEnviRepository.obtenerPorPedido(pedidoId);

    return { ...pedido, items, direEnvi };
  },
};
