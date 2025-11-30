// middlewares/notFound.js
export function notFound(req, res, _next) {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `No se encontró la ruta ${req.method} ${req.originalUrl}`
    }
  });
}
