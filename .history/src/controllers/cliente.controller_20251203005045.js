// src/controllers/cliente.controller.js
import { clienteRepository } from "../repositories/cliente.repository.js";

export async function list(req, res, next) {
  try {
    const rows = await clienteRepository.findAll();
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const cliente = await clienteRepository.findById(id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(cliente);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const { nombre, email, password, activo } = req.body;
    const nuevo = await clienteRepository.createFromAdmin({
      nombre,
      email,
      password,
      activo,
    });
    res.status(201).json(nuevo);
  } catch (err) {
    next(err);
  }
}

export async function updateFromAdmin(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { nombre, email, password, activo } = req.body;

    const actualizado = await clienteRepository.updateFromAdmin(id, {
      nombre,
      email,
      password,
      activo,
    });

    res.json(actualizado);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    await clienteRepository.remove(id);
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (err) {
    next(err);
  }
}
