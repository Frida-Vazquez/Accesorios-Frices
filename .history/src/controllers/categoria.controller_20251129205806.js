// controllers/categoria.controller.js
import {
  CategoriaCreateSchema,
  CategoriaUpdateSchema,
} from "../models/categoria.model.js";
import { categoriaService } from "../services/categoria.service.js";

export const listarCategorias = async (req, res, next) => {
  try {
    const data = await categoriaService.listar();
    res.json({ data, count: data.length });
  } catch (e) {
    next(e);
  }
};

export const obtenerCategoria = async (req, res, next) => {
  try {
    const cat = await categoriaService.obtener(req.params.id);
    res.json(cat);
  } catch (e) {
    next(e);
  }
};

export const crearCategoria = async (req, res, next) => {
  try {
    const payload = CategoriaCreateSchema.parse(req.body);
    const cat = await categoriaService.crear(payload);
    res.status(201).json(cat);
  } catch (e) {
    next(e);
  }
};

export const actualizarCategoria = async (req, res, next) => {
  try {
    const payload = CategoriaUpdateSchema.parse(req.body);
    const cat = await categoriaService.actualizar(req.params.id, payload);
    res.json(cat);
  } catch (e) {
    next(e);
  }
};

export const eliminarCategoria = async (req, res, next) => {
  try {
    await categoriaService.eliminar(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
