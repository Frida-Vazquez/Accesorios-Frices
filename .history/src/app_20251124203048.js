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
// Servir carpeta PUBLIC (frontend)
// public/index.html
// public/css/styles.css
// ======================================
app.use(express.static(path.join(__dirname, "../../public")));

// ======================================
// Rutas principales de la API
// http://localhost:3000/api/...
// ======================================
app.use("/api", routes);

// ======================================
// (Opcional) Health de la API
// http://localhost:3000/api/health
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
