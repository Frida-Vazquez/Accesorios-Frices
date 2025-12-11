// src/services/pedido.service.js
import { pedidoRepository } from "../repositories/pedido.repository.js";

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
};
