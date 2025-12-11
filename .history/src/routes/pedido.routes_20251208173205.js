// src/routes/pedido.routes.js
import { Router } from "express";
import {
  listarPedidos,
  obtenerPedido,
} from "../controllers/pedido.controller.js";
import { requireAuth } from "../middlewares/auth.js"; // 👈 solo requireAuth

const router = Router();

// Si quieres que solo pueda ver pedidos quien esté autenticado:
router.use(requireAuth);

router.get("/", listarPedidos);
router.get("/:id", obtenerPedido);

export default router;
