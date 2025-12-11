// src/routes/pedido.routes.js
import { Router } from "express";
import {
  listarPedidos,
  obtenerPedido,
  crearPedidoDesdeCarrito,
} from "../controllers/pedido.controller.js";

import { authRequired, requireRole } from "../middlewares/auth.js";

const router = Router();

// 🔹 ADMIN – ver todos los pedidos
router.get(
  "/",
  authRequired,
  requireRole("ADMIN"),
  listarPedidos
);

// 🔹 ADMIN – ver detalle de un pedido por ID
router.get(
  "/:id",
  authRequired,
  requireRole("ADMIN"),
  obtenerPedido
);

// 🔹 CLIENTE – crear pedido desde SU carrito
router.post(
  "/",
  authRequired, // solo necesita estar logueado
  crearPedidoDesdeCarrito
);

export default router;
