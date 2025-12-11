// src/routes/pedido.routes.js
import { Router } from "express";
import {
  listarPedidos,
  obtenerPedido,
} from "../controllers/pedido.controller.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

const router = Router();

// Todas las rutas de pedidos solo para ADMIN
router.use(requireAuth, requireAdmin);

router.get("/", listarPedidos);
router.get("/:id", obtenerPedido);

export default router;
