// src/routes/index.js
import { Router } from "express";

import authRouter from "./auth.routes.js";
import clientesRouter from "./clientes.routes.js";
import categoriasRouter from "./categorias.routes.js";
import productosRouter from "./productos.routes.js";

const router = Router();

// auth
router.use("/auth", authRouter);

// catálogos
router.use("/clientes", clientesRouter);
router.use("/categorias", categoriasRouter);
router.use("/productos", productosRouter);

export default router;
