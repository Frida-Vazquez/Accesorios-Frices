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
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Tu sesión expiró o no estás autenticado.",
      });
    }

    const clienteId = req.user.id;

    // Ahora la dirección se llama direEnvi
    const direEnvi = req.body?.direEnvi;
    if (!direEnvi) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: "Falta la dirección de envío.",
      });
    }

    const pedido = await pedidoService.crearDesdeCarrito(
      clienteId,
      direEnvi
    );

    return res.status(201).json({
      message: "Pedido creado correctamente",
      pedido,
    });
  } catch (e) {
    next(e);
  }
};

