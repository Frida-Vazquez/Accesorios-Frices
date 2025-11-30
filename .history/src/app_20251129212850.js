// src/app.js
import express from "express";
import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

import routes from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Resolver __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Body parser JSON
app.use(express.json());

// 1) Front Accesorios Frices en /
//    Sirve todo lo que esté en /public (index.html, app.js, estilos, etc.)
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

// 2) API principal (monta /api/...)
app.use("/api", routes);

// 3) Página admin (http://localhost:3000/admin)
app.get("/admin", (_req, res) => {
  res.sendFile(path.join(publicPath, "admin.html"));
});

// 4) Health propio de Accesorios Frices
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, msg: "API Accesorios Frices viva" });
});

// 5) Middlewares de 404 y errores
app.use(notFound);
app.use(errorHandler);

export default app;
