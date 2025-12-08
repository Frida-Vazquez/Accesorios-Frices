// src/controllers/carrito.controller.js
import { carritoService } from "../services/carrito.service.js";

export const obtenerCarrito = async (req, res, next) => {
  try {
    const clienteId = req.user.id;
    const data = await carritoService.obtenerCarrito(clienteId);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

export const agregarAlCarrito = async (req, res, next) => {
  try {
    const clienteId = req.user.id;
    const data = await carritoService.agregarItem(clienteId, req.body);
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
};

export const actualizarItemCarrito = async (req, res, next) => {
  try {
    const clienteId = req.user.id;
    const data = await carritoService.actualizarCantidad(clienteId, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

export const eliminarItemCarrito = async (req, res, next) => {
  try {
    const clienteId = req.user.id;
    const { productoId } = req.params;
    const numId = Number(productoId);
    const data = await carritoService.eliminarItem(clienteId, numId);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

export const vaciarCarrito = async (req, res, next) => {
  try {
    const clienteId = req.user.id;
    const data = await carritoService.vaciar(clienteId);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

export const checkoutCarrito = async (req, res, next) => {
  try {
    const clienteId = req.user.id;
    const result = await carritoService.checkout(clienteId);
    res.json(result);
  } catch (e) {
    next(e);
  }
};
