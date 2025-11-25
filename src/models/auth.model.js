// models/auth.model.js
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(8)
});
