import { Router } from "express";
import clientesRouter from "./clientes.routes.js";
import authRouter from "./auth.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

router.use("/auth", authRouter);      // /api/auth/login (pública)
router.use("/clientes", clientesRouter); // la vamos a proteger ahorita

export default router;
