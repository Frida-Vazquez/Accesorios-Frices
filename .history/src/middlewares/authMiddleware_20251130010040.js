// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("Falta JWT_SECRET en variables de entorno (authMiddleware)");
}

// Helper: extraer token del header Authorization
function getTokenFromHeader(req) {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
}

export const authMiddleware = {
  // ========= SOLO USUARIO AUTENTICADO =========
  requireAuth(req, res, next) {
    try {
      const token = getTokenFromHeader(req);
      if (!token) {
        return res
          .status(401)
          .json({ message: "No se proporcionó token de autenticación" });
      }

      const payload = jwt.verify(token, JWT_SECRET);
      // Guardamos info del usuario en la request
      req.user = {
        id: payload.sub,
        email: payload.email,
        roles: payload.roles || [],
      };

      next();
    } catch (err) {
      console.error("Error en requireAuth:", err.message);
      return res
        .status(401)
        .json({ message: "Token inválido o expirado", error: err.message });
    }
  },

  // ========= SOLO ADMIN =========
  requireAdmin(req, res, next) {
    try {
      const token = getTokenFromHeader(req);
      if (!token) {
        return res
          .status(401)
          .json({ message: "No se proporcionó token de autenticación" });
      }

      const payload = jwt.verify(token, JWT_SECRET);
      const roles = payload.roles || [];

      if (!roles.includes("ADMIN")) {
        return res
          .status(403)
          .json({ message: "Acceso restringido: requiere rol ADMIN" });
      }

      // guardamos también aquí el user
      req.user = {
        id: payload.sub,
        email: payload.email,
        roles,
      };

      next();
    } catch (err) {
      console.error("Error en requireAdmin:", err.message);
      return res
        .status(401)
        .json({ message: "Token inválido o expirado", error: err.message });
    }
  },
};
