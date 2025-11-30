// models/producto.model.js
import { z } from "zod";


export const ProductoCreateSchema = z.object({
  // Relación con categorías
  categoriaId: z
    .number({
      required_error: "El campo categoriaId es obligatorio",
      invalid_type_error: "categoriaId debe ser numérico",
    })
    .int()
    .positive(),

  // Datos básicos
  nombre: z
    .string({
      required_error: "El nombre es obligatorio",
    })
    .min(1, "El nombre no puede estar vacío")
    .trim(),

  descripcion: z.string().trim().optional(),

  precio: z
    .number({
      required_error: "El precio es obligatorio",
      invalid_type_error: "El precio debe ser numérico",
    })
    .nonnegative("El precio no puede ser negativo"),

  stock: z
    .number({
      invalid_type_error: "El stock debe ser un número entero",
    })
    .int()
    .nonnegative()
    .optional(),

  // URL de la imagen del producto
  urlImagen: z
    .string()
    .url("La URL de la imagen no es válida")
    .optional(),

  // ===== Campos específicos de joyería (opcionales) =====
  // Mapea a tipo_pieza en la BD
  tipoPieza: z
    .enum(["ARETES", "CADENA", "PULSERA", "ANILLO", "SET", "OTRO"])
    .optional(),

  material: z.string().trim().optional(),

  // Mapea a color_principal en la BD
  color: z.string().trim().optional(),

  // Mapean a es_hipoalergenico y es_ajustable en BD
  esHipoalergenico: z.boolean().optional(),
  esAjustable: z.boolean().optional(),

  // Mapea a largo_cm en BD
  largoCm: z
    .number({
      invalid_type_error: "largoCm debe ser numérico",
    })
    .nonnegative()
    .optional(),

  // ===== Flags de visibilidad / marketing =====
  activo: z.boolean().optional().default(true),

  destacado: z.boolean().optional().default(false),

  enOferta: z.boolean().optional().default(false),
});

/**
 * Para updates permitimos enviar cualquier campo de forma opcional.
 * Esto facilita usar PATCH en el controller.
 */
export const ProductoUpdateSchema = ProductoCreateSchema.partial();
