import { Router } from "express";
import authRoutes from "./auth.routes.js";
import clientesRoutes from "./clientes.routes.js";
import categoriasRoutes from "./categorias.routes.js";
import productosRoutes from "./productos.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/clientes", clientesRoutes);
router.use("/categorias", categoriasRoutes);
router.use("/productos", productosRoutes);

export default router;
