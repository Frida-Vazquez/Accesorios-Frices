import express from "express";
import path from "path";
import authRouter from "./routes/auth.routes.js";

const app = express();
const app = express();

// 👇 NECESARIO para leer JSON y forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- ¡ESTAS DOS LÍNEAS SON LAS IMPORTANTES! ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Si sirves archivos frontend
app.use(express.static(path.join(process.cwd(), "public")));

// Tus rutas API
app.use("/api/auth", authRouter);

export default app;
