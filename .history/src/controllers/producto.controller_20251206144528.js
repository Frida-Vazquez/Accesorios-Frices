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
    // 👀 DEBUG: qué está llegando del front
    console.log("BODY crearProducto:", req.body);
    console.log("FILE crearProducto:", req.file);

    // url de la imagen (coincide con tu columna url_imagen)
    const url_imagen = req.file ? `/uploads/${req.file.filename}` : null;

    const data = {
      ...req.body,
      url_imagen,
      precio: Number(req.body.precio || 0),
      stock: Number(req.body.stock || 0),
      categoria_id: Number(req.body.categoria_id),
      destacado:
        req.body.destacado === "true" || req.body.destacado === true,
    };

    const nuevo = await productoService.crear(data);
    res.status(201).json(nuevo);
  } catch (e) {
    next(e);
  }
};

export const actualizarProducto = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 👀 DEBUG: qué llega cuando actualizas
    console.log("BODY actualizarProducto:", req.body);
    console.log("FILE actualizarProducto:", req.file);

    const url_imagen = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.url_imagen || null;

    const data = {
      ...req.body,
      url_imagen,
      precio: Number(req.body.precio || 0),
      stock: Number(req.body.stock || 0),
      categoria_id: Number(req.body.categoria_id),
      destacado:
        req.body.destacado === "true" || req.body.destacado === true,
    };

    const actualizado = await productoService.actualizar(Number(id), data);
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
