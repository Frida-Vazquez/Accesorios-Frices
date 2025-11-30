// middlewares/notFound.js

export function notFound(req, res, _next) {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `La ruta ${req.method} ${req.originalUrl} no existe en Accesorios Frices.`,
      origen: "Accesorios Frices API",
      sugerencia: "Verifica la URL o consulta la documentación de la API."
    }
  });
}
