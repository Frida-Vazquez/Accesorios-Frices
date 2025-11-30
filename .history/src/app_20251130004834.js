// src/app.js
import express from "express";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import apiRoutes from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.resolve(__dirname, "../public");

app.use("/static", express.static(publicPath));

// FRONT (login, etc.)
app.get("/", (_req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/admin.html", (_req, res) => {
  res.sendFile(path.join(publicPath, "admin.html"));
});

// API
app.use("/api", apiRoutes);

// middlewares de error
app.use(notFound);
app.use(errorHandler);

export default app;
