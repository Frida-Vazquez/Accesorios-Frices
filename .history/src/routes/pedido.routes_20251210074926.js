import { Router } from "express";
import {
  listarPedidos,
  obtenerPedido,
  crearPedidoDesdeCarrito,
} from "../controllers/pedido.controller.js";

import { authRequired, requireRole } from "../middlewares/auth.js";

const router = Router();

// ADMIN
router.get("/", authRequired, requireRole("ADMIN"), listarPedidos);
router.get("/:id", authRequired, requireRole("ADMIN"), obtenerPedido);

// CLIENTE
router.post("/", authRequired, crearPedidoDesdeCarrito);

// Obtener los items de un pedido (para detalle)
async obtenerItemsPorPedido(pedidoId) {
  const [rows] = await pool.query(
    `
    SELECT
      pi.producto_id,
      p.nombre,
      p.url_imagen AS urlImagen,
      pi.cantidad,
      pi.precio_unitario,
      pi.subtotal
    FROM pedido_items pi
    JOIN productos p ON p.id = pi.producto_id
    WHERE pi.pedido_id = ?
    ORDER BY pi.id ASC
    `,
    [pedidoId]
  );

  return rows;
},


export default router;
