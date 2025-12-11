// src/controllers/pedido.controller.js
import { pedidoService } from "../services/pedido.service.js";

/**
 * =======================================
 * 🟣 ADMIN: Listar todos los pedidos
 * =======================================
 */
export const listarPedidos = async (req, res, next) => {
  try {
    const pedidos = await pedidoService.listar();
    res.json(pedidos);
  } catch (e) {
    next(e);
  }
};

/**
 * =======================================
 * 🟣 ADMIN: Obtener un pedido por ID
 * =======================================
 */
export const obtenerPedido = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pedido = await pedidoService.obtener(Number(id));
    res.json(pedido);
  } catch (e) {
    next(e);
  }
};

/**
 * =======================================
 * 🟢 CLIENTE: Crear pedido desde carrito
 * =======================================
 */
export const crearPedidoDesdeCarrito = async (req, res, next) => {
  try {
    // 🔐 Validación: si el token expiró o no existe, req.user NO existe
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Tu sesión expiró o no estás autenticado."
      });
    }

    const clienteId = req.user.id;

    // Crear el pedido con carritoRepository y pedidoRepository
    const pedido = await pedidoService.crearDesdeCarrito(clienteId);

    return res.status(201).json({
      message: "Pedido creado correctamente",
      pedido
    });
  } catch (e) {
    next(e);
  }
};
