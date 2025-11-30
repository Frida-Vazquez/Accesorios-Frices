// src/routes/index.js
import { Router } from "express";

import authRouter from "./auth.routes.js";
import clientesRouter from "./clientes.routes.js";
import categoriaRouter from "./categoria.routes.js";
import productoRouter from "./producto.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/clientes", clientesRouter);
router.use("/categorias", categoriaRouter);
router.use("/productos", productoRouter);

export default router;
