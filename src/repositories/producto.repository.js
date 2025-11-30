// src/repositories/producto.repository.js
import { pool } from "../utils/db.js";

export const productoRepository = {
  async findAll() {
    const [rows] = await pool.query(
      `SELECT p.id, p.categoria_id, c.nombre AS categoria,
              p.nombre, p.descripcion, p.precio, p.stock,
              p.url_imagen, p.activo,
              p.tipo_pieza, p.material, p.color_principal,
              p.es_hipoalergenico, p.es_ajustable, p.largo_cm,
              p.created_at, p.updated_at
       FROM productos p
       INNER JOIN categorias c ON c.id = p.categoria_id
       ORDER BY p.id ASC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT p.id, p.categoria_id, c.nombre AS categoria,
              p.nombre, p.descripcion, p.precio, p.stock,
              p.url_imagen, p.activo,
              p.tipo_pieza, p.material, p.color_principal,
              p.es_hipoalergenico, p.es_ajustable, p.largo_cm,
              p.created_at, p.updated_at
       FROM productos p
       INNER JOIN categorias c ON c.id = p.categoria_id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create(data) {
    const {
      categoria_id,
      nombre,
      descripcion,
      precio,
      stock,
      url_imagen,
      activo = 1,
      tipo_pieza = "OTRO",
      material,
      color_principal,
      es_hipoalergenico = 0,
      es_ajustable = 0,
      largo_cm,
    } = data;

    const [result] = await pool.query(
      `INSERT INTO productos (
         categoria_id, nombre, descripcion, precio, stock,
         url_imagen, activo, tipo_pieza, material, color_principal,
         es_hipoalergenico, es_ajustable, largo_cm
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        categoria_id,
        nombre,
        descripcion,
        precio,
        stock,
        url_imagen,
        activo ? 1 : 0,
        tipo_pieza,
        material,
        color_principal,
        es_hipoalergenico ? 1 : 0,
        es_ajustable ? 1 : 0,
        largo_cm,
      ]
    );

    return this.findById(result.insertId);
  },

  async update(id, data) {
    const {
      categoria_id,
      nombre,
      descripcion,
      precio,
      stock,
      url_imagen,
      activo,
      tipo_pieza,
      material,
      color_principal,
      es_hipoalergenico,
      es_ajustable,
      largo_cm,
    } = data;

    const [result] = await pool.query(
      `UPDATE productos
       SET
         categoria_id      = IFNULL(?, categoria_id),
         nombre            = IFNULL(?, nombre),
         descripcion       = IFNULL(?, descripcion),
         precio            = IFNULL(?, precio),
         stock             = IFNULL(?, stock),
         url_imagen        = IFNULL(?, url_imagen),
         activo            = IFNULL(?, activo),
         tipo_pieza        = IFNULL(?, tipo_pieza),
         material          = IFNULL(?, material),
         color_principal   = IFNULL(?, color_principal),
         es_hipoalergenico = IFNULL(?, es_hipoalergenico),
         es_ajustable      = IFNULL(?, es_ajustable),
         largo_cm          = IFNULL(?, largo_cm)
       WHERE id = ?`,
      [
        categoria_id ?? null,
        nombre ?? null,
        descripcion ?? null,
        precio ?? null,
        stock ?? null,
        url_imagen ?? null,
        activo !== undefined ? (activo ? 1 : 0) : null,
        tipo_pieza ?? null,
        material ?? null,
        color_principal ?? null,
        es_hipoalergenico !== undefined ? (es_hipoalergenico ? 1 : 0) : null,
        es_ajustable !== undefined ? (es_ajustable ? 1 : 0) : null,
        largo_cm ?? null,
        id,
      ]
    );

    if (result.affectedRows === 0) return null;
    return this.findById(id);
  },

  async remove(id) {
    const [result] = await pool.query(
      `DELETE FROM productos WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  },
};
