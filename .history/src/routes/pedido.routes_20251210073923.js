import { Router } from "express";
import {
  listarPedidos,
  obtenerPedido,
  crearPedidoDesdeCarrito,
} from "../controllers/pedido.controller.js";

import { authRequired, requireRole } from "../middlewares/auth.js";

const router = Router();

// ADMIN
router.get("/", authRequired, requireRole("ADMIN"), listarPedidos);
router.get("/:id", authRequired, requireRole("ADMIN"), obtenerPedido);

// CLIENTE
router.post("/", authRequired, crearPedidoDesdeCarrito);

export default router;
