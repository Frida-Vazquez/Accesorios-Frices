// src/controllers/pedido.controller.js
import { pedidoService } from "../services/pedido.service.js";

export const listarPedidos = async (req, res, next) => {
  try {
    const pedidos = await pedidoService.listar();
    res.json(pedidos);
  } catch (e) {
    next(e);
  }
};

export const obtenerPedido = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pedido = await pedidoService.obtener(Number(id));
    res.json(pedido);
  } catch (e) {
    next(e);
  }
};

// 🔹 CLIENTE: crear pedido desde el carrito
export const crearPedidoDesdeCarrito = async (req, res, next) => {
  try {
    // 👇 evitar TypeError cuando no hay user
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Sesión expirada. Vuelve a iniciar sesión." });
    }

    const clienteId = req.user.id;

    const pedido = await pedidoService.crearDesdeCarrito(clienteId);

    res.status(201).json({
      message: "Pedido creado correctamente",
      pedido,
    });
  } catch (e) {
    next(e);
  }
};
