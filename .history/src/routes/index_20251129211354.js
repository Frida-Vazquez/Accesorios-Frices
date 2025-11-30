// routes/index.js
import { Router } from "express";

// Importar subrutas
import clientesRouter from "./clientes.routes.js";
import authRouter from "./auth.routes.js";
import categoriasRouter from "./categorias.routes.js";
import productosRouter from "./productos.routes.js";

const router = Router();

// =======================================
// Health check
// =======================================
router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Accesorios Frices API",
    time: new Date().toISOString(),
  });
});

// =======================================
// Rutas principales
// =======================================
router.use("/auth", authRouter);
router.use("/clientes", clientesRouter);
router.use("/categorias", categoriasRouter);
router.use("/productos", productosRouter);

export default router;
