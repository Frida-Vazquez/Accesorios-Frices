// src/models/carrito.model.js
import { z } from "zod";

export const CarritoAddItemSchema = z.object({
  productoId: z.number({
    required_error: "productoId es obligatorio",
    invalid_type_error: "productoId debe ser numérico",
  }).int().positive(),
  cantidad: z.number({
    required_error: "cantidad es obligatoria",
    invalid_type_error: "cantidad debe ser numérica",
  }).int().min(1).max(99).default(1),
});

export const CarritoUpdateItemSchema = z.object({
  productoId: z.number().int().positive(),
  cantidad: z.number().int().min(0).max(99),
});
