// src/routes/pedido.routes.js
import { Router } from "express";
import {
  listarPedidos,
  obtenerPedido,
  crearPedidoDesdeCarrito,
} from "../controllers/pedido.controller.js";
// si tienes este middleware, descomenta y úsalo
import { requireAuthCliente } from "../middlewares/authCliente.js";

const router = Router();

// 🔹 ADMIN (lista / detalle) – puedes luego proteger con requireAuthAdmin
router.get("/", listarPedidos);
router.get("/:id", obtenerPedido);

// 🔹 CLIENTE – crear pedido desde carrito
router.post("/", requireAuthCliente, crearPedidoDesdeCarrito);
// si todavía no te funciona el middleware, temporalmente podrías usar:
// router.post("/", crearPedidoDesdeCarrito);

export default router;
