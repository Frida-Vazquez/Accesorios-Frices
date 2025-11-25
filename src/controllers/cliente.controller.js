import { ClienteCreateSchema, ClienteUpdateSchema } from "../models/cliente.model.js";
import { clienteService } from "../services/cliente.service.js";

export const listarClientes = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit ?? 50);
    const offset = Number(req.query.offset ?? 0);
    const data = await clienteService.listar({ limit, offset });
    res.json({ data, meta: { limit, offset, count: data.length } });
  } catch (e) { next(e); }
};

export const obtenerCliente = async (req, res, next) => {
  try {
    const c = await clienteService.obtener(req.params.id);
    res.json(c);
  } catch (e) { next(e); }
};

export const crearCliente = async (req, res, next) => {
  try {
    const payload = ClienteCreateSchema.parse(req.body);
    const c = await clienteService.crear(payload);
    res.status(201).json(c);
  } catch (e) { next(e); }
};

export const actualizarCliente = async (req, res, next) => {
  try {
    const payload = ClienteUpdateSchema.parse(req.body);
    const c = await clienteService.actualizar(req.params.id, payload);
    res.json(c);
  } catch (e) { next(e); }
};

export const eliminarCliente = async (req, res, next) => {
  try {
    await clienteService.eliminar(req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
};
