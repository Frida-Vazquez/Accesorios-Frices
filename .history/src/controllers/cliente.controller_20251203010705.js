// src/controllers/cliente.controller.js
import { clienteRepository } from "../repositories/cliente.repository.js";
import bcrypt from "bcryptjs";

// LISTAR TODOS
export async function list(req, res, next) {
  try {
    const rows = await clienteRepository.findAll();
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// OBTENER POR ID
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

// CREAR DESDE ADMIN
export async function createFromAdmin(req, res, next) {
  try {
    const { nombre, email, password, activo } = req.body;

    const password_hash = await bcrypt.hash(password, 10);

    const nuevo = await clienteRepository.create({
      nombre,
      email,
      password_hash,
      activo,
    });

    res.status(201).json(nuevo);
  } catch (err) {
    next(err);
  }
}

// ACTUALIZAR DESDE ADMIN
export async function updateFromAdmin(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { nombre, email, password, activo } = req.body;

    let password_hash = null;
    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    const actualizado = await clienteRepository.updateFromAdmin(id, {
      nombre,
      email,
      password_hash,
      activo,
    });

    res.json(actualizado);
  } catch (err) {
    next(err);
  }
}

// ELIMINAR
export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    await clienteRepository.remove(id);
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (err) {
    next(err);
  }
}
