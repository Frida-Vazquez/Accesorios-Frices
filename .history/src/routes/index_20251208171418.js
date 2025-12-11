// src/routes/index.js
import { Router } from "express";

import authRouter from "./auth.routes.js";
import clientesRouter from "./clientes.routes.js";
import categoriasRouter from "./categorias.routes.js";
import productosRouter from "./productos.routes.js";
import productosRoutes from "./productos.routes.js";
import carritoRouter from "./carrito.routes.js";  // 👈 NUEVO
import pedidoRouter from "./pedido.routes.js"; // 👈 NUEVO

const router = Router();

// auth
router.use("/auth", authRouter);

// catálogos
router.use("/clientes", clientesRouter);
router.use("/categorias", categoriasRouter);
router.use("/productos", productosRouter);
router.use("/productos", productosRoutes);
router.use("/pedidos", pedidoRouter); // 👈 NUEVO


// carrito 👇
router.use("/carrito", carritoRouter);

export default router;
