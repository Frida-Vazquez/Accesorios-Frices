import express from "express";
import path from "path";
import authRouter from "./routes/auth.routes.js";

const app = express();


// --- ¡ESTAS DOS LÍNEAS SON LAS IMPORTANTES! ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Si sirves archivos frontend
app.use(express.static(path.join(process.cwd(), "public")));

// Tus rutas API
app.use("/api/auth", authRouter);

export default app;
