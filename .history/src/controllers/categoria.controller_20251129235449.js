// src/controllers/categoria.controller.js
import { categoriaService } from "../services/categoria.service.js";

export const listarCategorias = async (req, res, next) => {
  try {
    const categorias = await categoriaService.listar();
    res.json(categorias);
  } catch (e) {
    next(e);
  }
};

export const obtenerCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cat = await categoriaService.obtener(Number(id));
    res.json(cat);
  } catch (e) {
    next(e);
  }
};

export const crearCategoria = async (req, res, next) => {
  try {
    const { nombre, descripcion, activa } = req.body;
    const nueva = await categoriaService.crear({ nombre, descripcion, activa });
    res.status(201).json(nueva);
  } catch (e) {
    next(e);
  }
};

export const actualizarCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, activa } = req.body;

    const actualizada = await categoriaService.actualizar(Number(id), {
      nombre,
      descripcion,
      activa,
    });

    res.json(actualizada);
  } catch (e) {
    next(e);
  }
};

export const eliminarCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    await categoriaService.eliminar(Number(id));
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
