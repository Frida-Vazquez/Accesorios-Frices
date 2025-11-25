import express from "express";
import "dotenv/config";
import routes from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

// Rutas principales
app.use("/api", routes);

// frices root
app.get("/", (_req, res) => res.json({ ok: true, msg: "API viva" }));

// 404 y errores
app.use(notFound);
app.use(errorHandler);

export default app;
