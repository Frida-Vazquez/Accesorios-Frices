// src/routes/carrito.routes.js
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

import {
  obtenerCarrito,
  agregarAlCarrito,
  actualizarItemCarrito,
  eliminarItemCarrito,
  vaciarCarrito,
  checkoutCarrito,
} from "../controllers/carrito.controller.js";

const router = Router();

// Todas las rutas de carrito requieren estar logueado
router.use(authMiddleware.requireAuth);

// GET /api/carrito
router.get("/", obtenerCarrito);

// POST /api/carrito/agregar
router.post("/agregar", agregarAlCarrito);

// PUT /api/carrito/item  (cambiar cantidad)
router.put("/item", actualizarItemCarrito);

// DELETE /api/carrito/item/:productoId
router.delete("/item/:productoId", eliminarItemCarrito);

// POST /api/carrito/vaciar
router.post("/vaciar", vaciarCarrito);

// POST /api/carrito/checkout  (simulado)
router.post("/checkout", checkoutCarrito);

export default router;
