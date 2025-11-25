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
// Ruta ABSOLUTA a la carpeta PUBLIC
// (Sube dos niveles desde utils → src → raíz del proyecto)
// ======================================
const publicPath = path.resolve(__dirname, "../../public");

console.log("📁 Public path cargado:", publicPath);

// ======================================
// Servir frontend
// ======================================
app.use(express.static(publicPath));

// ======================================
// Rutas principales de API
// ======================================
app.use("/api", routes);

// ======================================
// Health de API
// ======================================
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, msg: "API viva" })
);

// ======================================
// 404 y errores
// ======================================
app.use(notFound);
app.use(errorHandler);

export default app;
