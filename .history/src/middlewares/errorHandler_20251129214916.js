// middlewares/errorHandler.js
import { ZodError } from "zod";

export const errorHandler = (err, _req, res, _next) => {
  console.error("❌ Error:", err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Datos inválidos",
        issues: err.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message
        }))
      }
    });
  }

  const status = err.status ?? 500;

  res.status(status).json({
    error: {
      code: err.code || "ERROR",
      message: err.message || "Error inesperado"
    }
  });
};
