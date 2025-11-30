// models/producto.model.js
import { z } from "zod";

export const ProductoCreateSchema = z.object({
  nombre: z.string().min(1, "nombre requerido").trim(),
  categoriaId: z
    .number({
      required_error: "categoriaId requerido",
      invalid_type_error: "categoriaId debe ser numérico",
    })
    .int()
    .positive(),
  precio: z
    .number({
      required_error: "precio requerido",
      invalid_type_error: "precio debe ser numérico",
    })
    .nonnegative("el precio no puede ser negativo"),
  stock: z
    .number({
      invalid_type_error: "stock debe ser numérico",
    })
    .int()
    .nonnegative()
    .default(0),

  urlImagen: z.string().url("URL de imagen no válida").trim().optional(),
  descripcion: z.string().trim().optional(),
  material: z.string().trim().optional(),
  color: z.string().trim().optional(),

  activo: z.boolean().optional().default(true),
  destacado: z.boolean().optional().default(false),
  enOferta: z.boolean().optional().default(false),
});

export const ProductoUpdateSchema = ProductoCreateSchema.partial();
