import { z } from "zod";

export const ClienteCreateSchema = z.object({
  nombre: z.string().min(1, "nombre requerido").trim(),
  email: z.string().email("email inválido").trim(),
  password: z.string().min(8, "mínimo 8 caracteres"),
  activo: z.boolean().optional()
});

export const ClienteUpdateSchema = z.object({
  nombre: z.string().min(1).trim().optional(),
  email: z.string().email().trim().optional(),
  password: z.string().min(8).optional(),
  activo: z.boolean().optional()
});
