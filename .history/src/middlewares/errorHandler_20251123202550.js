// middlewares/errorHandler.js
import { ZodError } from "zod";

const isProd = process.env.NODE_ENV === "production";

export function errorHandler(err, _req, res, _next) {
  // 🔹 Logs para ti (consola)
  if (err instanceof ZodError) {
    console.error("❌ Error de validación Zod:", JSON.stringify(err.issues, null, 2));
  } else {
    console.error("❌ Error:", err);
  }

  // 🔹 Errores de validación (Zod)
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Datos de entrada no válidos",
        // Opcional: simplificamos los mensajes para el cliente
        issues: err.issues.map(issue => ({
          path: issue.path.join("."),
          message: issue.message
        }))
      }
    });
  }

  // 🔹 Resto de errores (servicios, repos, etc.)
  const status = Number.isInteger(err.status) ? err.status : 500;
  const isInternal = status === 500;

  const payload = {
    error: {
      code: isInternal ? "INTERNAL_SERVER_ERROR" : (err.code || "ERROR"),
      message: isInternal
        ? "Ocurrió un error inesperado. Intenta más tarde."
        : err.message || "Ocurrió un error."
    }
  };

  // Si quisieras, podrías incluir detalles extra en dev (yo lo dejo oculto)
  if (!isProd && err.stack && isInternal) {
    payload.error.stack = err.stack; // puedes quitar esto si no lo quieres NUNCA
  }

  res.status(status).json(payload);
}
