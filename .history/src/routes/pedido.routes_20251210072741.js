// src/routes/pedido.routes.js
import { Router } from "express";
import {
  listarPedidos,
  obtenerPedido,
  crearPedidoDesdeCarrito,
} from "../controllers/pedido.controller.js";

// 👇 usa el middleware que ya existe en auth.js
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

// 🔹 ADMIN (lista / detalle) – luego si quieres los proteges con otro middleware de admin
router.get("/", listarPedidos);
router.get("/:id", obtenerPedido);

// 🔹 CLIENTE – crear pedido desde carrito
router.post("/", requireAuth, crearPedidoDesdeCarrito);

export default router;
