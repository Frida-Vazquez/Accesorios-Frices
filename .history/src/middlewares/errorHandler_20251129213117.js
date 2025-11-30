// middlewares/auth.js
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("Falta JWT_SECRET en el archivo .env");
}

/**
 * =======================================
 * 🔐 authRequired
 * Verifica que el usuario tenga un token válido
 * =======================================
 */
export const authRequired = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Debes iniciar sesión para acceder a esta función (Accesorios Frices)."
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles || [], // ADMIN o CLIENTE
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Tu sesión expiró o el token es inválido."
    });
  }
};

/**
 * =======================================
 * 🔐 requireRole("ADMIN")
 * Verifica que el usuario tenga el rol adecuado
 * =======================================
 */
export const requireRole = (requiredRole) => {
  return (req, res, next) => {
    const roles = req.user?.roles || [];

    if (!roles.includes(requiredRole)) {
      return res.status(403).json({
        error: "FORBIDDEN",
        message: `No tienes permisos para acceder a esta sección del panel de administración de Accesorios Frices.`,
      });
    }

    next();
  };
};
