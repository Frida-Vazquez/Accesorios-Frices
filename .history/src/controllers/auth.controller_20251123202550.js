// controllers/auth.controller.js
import { LoginSchema } from "../models/auth.model.js";
import { authService } from "../services/auth.service.js";

export const login = async (req, res, next) => {
  try {
    const payload = LoginSchema.parse(req.body);
    const result = await authService.login(payload);
    res.json(result);
  } catch (e) {
    next(e);
  }
};
