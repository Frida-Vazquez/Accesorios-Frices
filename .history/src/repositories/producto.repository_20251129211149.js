// repositories/producto.repository.js
import { pool } from "../utils/db.js";

export const productoRepository = {
  // ============================
  // Listar productos (con filtro opcional por categoría)
  // ============================
  async findAll({ categoriaId } = {}) {
    let sql = `
      SELECT 
        p.id,
        p.categoria_id AS categoriaId,
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock,
        p.url_imagen AS urlImagen,
        p.activo,
        
        -- Campos específicos de joyería
        p.tipo_pieza AS tipoPieza,
        p.material,
        p.color_principal AS color,
        p.es_hipoalergenico AS esHipoalergenico,
        p.es_ajustable AS esAjustable,
        p.largo_cm AS largoCm,
        
        -- Flags de marketing
        p.destacado,
        p.en_oferta AS enOferta,
        
        p.created_at AS createdAt,
        p.updated_at AS updatedAt,
        c.nombre AS categoriaNombre
      FROM productos p
      JOIN categorias c ON c.id = p.categoria_id
    `;

    const params = [];
    if (categoriaId) {
      sql += " WHERE p.categoria_id = ?";
      params.push(categoriaId);
    }
    sql += " ORDER BY p.nombre ASC";

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  // ============================
  // Buscar producto por ID
  // ============================
  async findById(id) {
    const [rows] = await pool.query(
      `
      SELECT 
        p.id,
        p.categoria_id AS categoriaId,
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock,
        p.url_imagen AS urlImagen,
        p.activo,
        
        p.tipo_pieza AS tipoPieza,
        p.material,
        p.color_principal AS color,
        p.es_hipoalergenico AS esHipoalergenico,
        p.es_ajustable AS esAjustable,
        p.largo_cm AS largoCm,
        
        p.destacado,
        p.en_oferta AS enOferta,
        
        p.created_at AS createdAt,
        p.updated_at AS updatedAt,
        c.nombre AS categoriaNombre
      FROM productos p
      JOIN categorias c ON c.id = p.categoria_id
      WHERE p.id = ?
      `,
      [id]
    );
    return rows[0] ?? null;
  },

  // ============================
  // Crear producto
  // ============================
  async create(data) {
    const [result] = await pool.query(
      `
      INSERT INTO productos
        (categoria_id, nombre, descripcion, precio, stock, url_imagen,
         activo, tipo_pieza, material, color_principal,
         es_hipoalergenico, es_ajustable, largo_cm,
         destacado, en_oferta)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        data.categoriaId,
        data.nombre,
        data.descripcion ?? null,
        data.precio,
        data.stock ?? 0,
        data.urlImagen ?? null,
        data.activo ?? 1,
        data.tipoPieza ?? "OTRO",
        data.material ?? null,
        data.color ?? null,
        data.esHipoalergenico ? 1 : 0,
        data.esAjustable ? 1 : 0,
        data.largoCm ?? null,
        data.destacado ? 1 : 0,
        data.enOferta ? 1 : 0,
      ]
    );

    return this.findById(result.insertId);
  },

  // ============================
  // Actualizar producto (PATCH dinámico)
  // ============================
  async update(id, data) {
    const fields = [];
    const values = [];

    if (data.categoriaId !== undefined) {
      fields.push("categoria_id = ?");
      values.push(data.categoriaId);
    }
    if (data.nombre !== undefined) {
      fields.push("nombre = ?");
      values.push(data.nombre);
    }
    if (data.descripcion !== undefined) {
      fields.push("descripcion = ?");
      values.push(data.descripcion ?? null);
    }
    if (data.precio !== undefined) {
      fields.push("precio = ?");
      values.push(data.precio);
    }
    if (data.stock !== undefined) {
      fields.push("stock = ?");
      values.push(data.stock);
    }
    if (data.urlImagen !== undefined) {
      fields.push("url_imagen = ?");
      values.push(data.urlImagen ?? null);
    }
    if (data.activo !== undefined) {
      fields.push("activo = ?");
      values.push(data.activo ? 1 : 0);
    }

    // Campos de joyería
    if (data.tipoPieza !== undefined) {
      fields.push("tipo_pieza = ?");
      values.push(data.tipoPieza ?? "OTRO");
    }
    if (data.material !== undefined) {
      fields.push("material = ?");
      values.push(data.material ?? null);
    }
    if (data.color !== undefined) {
      fields.push("color_principal = ?");
      values.push(data.color ?? null);
    }
    if (data.esHipoalergenico !== undefined) {
      fields.push("es_hipoalergenico = ?");
      values.push(data.esHipoalergenico ? 1 : 0);
    }
    if (data.esAjustable !== undefined) {
      fields.push("es_ajustable = ?");
      values.push(data.esAjustable ? 1 : 0);
    }
    if (data.largoCm !== undefined) {
      fields.push("largo_cm = ?");
      values.push(data.largoCm ?? null);
    }

    // Flags de marketing
    if (data.destacado !== undefined) {
      fields.push("destacado = ?");
      values.push(data.destacado ? 1 : 0);
    }
    if (data.enOferta !== undefined) {
      fields.push("en_oferta = ?");
      values.push(data.enOferta ? 1 : 0);
    }

    // Si no hay nada que actualizar, regresamos el producto actual
    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const [result] = await pool.query(
      `UPDATE productos SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) return null;
    return this.findById(id);
  },

  // ============================
  // Eliminar producto
  // ============================
  async remove(id) {
    const [result] = await pool.query(
      `DELETE FROM productos WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  },
};
