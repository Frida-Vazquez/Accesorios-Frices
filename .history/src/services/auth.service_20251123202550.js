// services/auth.service.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { clienteRepository } from "../repositories/cliente.repository.js";

const { JWT_SECRET, JWT_EXPIRES_IN = "1h" } = process.env;

if (!JWT_SECRET) {
  throw new Error("Falta JWT_SECRET en variables de entorno");
}

export const authService = {
  async login({ email, password }) {
    const cliente = await clienteRepository.findByEmail(email);
    if (!cliente) {
      const err = new Error("Credenciales inválidas");
      err.status = 401;
      throw err;
    }

    // aquí sí necesitamos el hash
    const { id, password_hash, activo } = cliente;

    // opcional: checar si está activo
    if (activo === 0 || activo === false) {
      const err = new Error("Cuenta inactiva");
      err.status = 403;
      throw err;
    }

    const ok = await bcrypt.compare(password, password_hash);
    if (!ok) {
      const err = new Error("Credenciales inválidas");
      err.status = 401;
      throw err;
    }

    const payload = { sub: id, email }; // sub = subject (id del usuario)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // no regreses el hash
    return {
      token,
      user: {
        id,
        nombre: cliente.nombre,
        email: cliente.email
      }
    };
  }
};
