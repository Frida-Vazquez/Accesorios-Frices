// src/routes/pedido.routes.js
import { Router } from "express";
import {
  listarPedidos,
  obtenerPedido,
} from "../controllers/pedido.controller.js";

const router = Router();

// ⚠️ Por ahora SIN requireAuth para no romper nada
// Luego podemos agregar el auth cuando veamos cómo está tu middleware

router.get("/", listarPedidos);
router.get("/:id", obtenerPedido);

export default router;
