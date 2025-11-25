import { Router } from "express";
import {
  listarClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} from "../controllers/cliente.controller.js";

const router = Router();

router.get("/", listarClientes);
router.get("/:id", obtenerCliente);
router.post("/", crearCliente);
router.patch("/:id", actualizarCliente);
router.delete("/:id", eliminarCliente);

export default router;
