import express from "express";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import routes from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

// ======================================
// Resolver __dirname (ES Modules)
// ======================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================================
// Ruta absoluta a /public
// ======================================

const publicPath = path.resolve(__dirname, "../../public");
console.log("📁 Public path cargado:", publicPath);

// ======================================
// Servir archivos estáticos de /public
//  - /           -> index.html (lo forzamos abajo)
//  - /css/...    -> archivos css
//  - /js/...     -> archivos js
// ======================================
app.use(express.static(publicPath));

// ======================================
// Rutas principales de la API
// ======================================
app.use("/api", routes);

// ======================================
// FORZAR que GET / devuelva index.html
// (para que no se vaya al notFound)
// ======================================
app.get("/", (_req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// ======================================
// Health de la API
// ======================================
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, msg: "API viva" });
});

// ======================================
// 404 y errores
// ======================================
app.use(notFound);
app.use(errorHandler);

export default app;
