// src/routes/pedido.routes.js
import { Router } from "express";
import {
  listarPedidos,
  obtenerPedido,
  crearPedidoDesdeCarrito,
} from "../controllers/pedido.controller.js";

// ❌ QUITAMOS ESTE IMPORT POR AHORA
// import { requireAuth } from "../middlewares/auth.js";

const router = Router();

// 🔹 ADMIN (lista / detalle)
router.get("/", listarPedidos);
router.get("/:id", obtenerPedido);

// 🔹 CLIENTE – crear pedido desde carrito
// POR AHORA SIN AUTH PARA QUE NO TRUENE
router.post("/", crearPedidoDesdeCarrito);

export default router;
