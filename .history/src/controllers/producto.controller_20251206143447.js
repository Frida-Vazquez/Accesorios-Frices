// src/controllers/producto.controller.js
import { productoService } from "../services/producto.service.js";

export const listarProductos = async (req, res, next) => {
  try {
    const productos = await productoService.listar();
    res.json(productos);
  } catch (e) {
    next(e);
  }
};

export const obtenerProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prod = await productoService.obtener(Number(id));
    res.json(prod);
  } catch (e) {
    next(e);
  }
};

export const crearProducto = async (req, res, next) => {
  try {
    // ← AQUI CAPTURAMOS LA IMAGEN
    const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;

    const nuevo = await productoService.crear({
      ...req.body,
      imagen_url,
    });

    res.status(201).json(nuevo);
  } catch (e) {
    next(e);
  }
};

export const actualizarProducto = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Si sube nueva imagen → usarla. Si no → dejar la existente.
    const imagen_url = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imagen_url || null;

    const actualizado = await productoService.actualizar(Number(id), {
      ...req.body,
      imagen_url,
    });

    res.json(actualizado);
  } catch (e) {
    next(e);
  }
};

export const eliminarProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productoService.eliminar(Number(id));
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
