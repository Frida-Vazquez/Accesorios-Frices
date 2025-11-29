import express from "express";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import routes from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import { homePage } from "./frontend/pages/home.js";
import { loginPage } from "./frontend/pages/login/login.js";
import { registerPage } from "./frontend/pages/register.js";

const app = express();

// 🔹 AÑADE ESTO
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- lo de __dirname y public ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.resolve(__dirname, "../public");
app.use("/static", express.static(publicPath));

// Rutas API
app.use("/api", routes);

// Rutas frontend
app.get("/", (_req, res) => res.send(homePage()));
app.get("/login", (_req, res) => res.send(loginPage()));
app.get("/registro", (_req, res) => res.send(registerPage()));

// 404 y errores
app.use(notFound);
app.use(errorHandler);

export default app;
