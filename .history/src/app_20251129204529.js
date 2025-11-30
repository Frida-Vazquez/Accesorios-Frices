// src/app.js
import express from "express";
import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

import routes from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Resolver __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares para leer JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1) Front ecommerce en /  (index.html, CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname, "..", "public")));

// 2) API (por ejemplo: /api/clientes, /api/productos, /api/categorias, etc.)
app.use("/api", routes);

// 3) Página admin (http://localhost:3000/admin)
//    Aquí irá tu panel para CRUD de catálogos
app.get("/admin", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin.html"));
});

// 4) Healthcheck de la API
app.get("/api/frives", (_req, res) => {
  res.json({ ok: true, msg: "API Accesorios Frices viva" });
});

// 5) Middlewares de error (404 y errores generales)
app.use(notFound);
app.use(errorHandler);

export default app;
