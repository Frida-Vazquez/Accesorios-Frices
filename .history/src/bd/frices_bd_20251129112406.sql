---------------------------------------------------
-- 9) CARRITOS DE COMPRA
---------------------------------------------------
CREATE TABLE IF NOT EXISTS carritos (
    id_carrito      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_cliente      BIGINT UNSIGNED NOT NULL,
    estado          ENUM('ABIERTO','CONVERTIDO','CANCELADO') NOT NULL DEFAULT 'ABIERTO',
    creado_en       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_carrito_cliente
        FOREIGN KEY (id_cliente) REFERENCES clientes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

---------------------------------------------------
-- 10) ÍTEMS DEL CARRITO
---------------------------------------------------
CREATE TABLE IF NOT EXISTS carrito_items (
    id_item         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_carrito      BIGINT UNSIGNED NOT NULL,
    id_producto     INT UNSIGNED NOT NULL,
    cantidad        INT UNSIGNED NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_item_carrito
        FOREIGN KEY (id_carrito) REFERENCES carritos(id_carrito)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_item_producto
        FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    UNIQUE KEY uk_carrito_producto (id_carrito, id_producto)
) ENGINE=InnoDB;

---------------------------------------------------
-- 11) PEDIDOS (VENTAS)
---------------------------------------------------
CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_cliente      BIGINT UNSIGNED NOT NULL,
    id_direccion    INT UNSIGNED NULL,
    total           DECIMAL(10,2) NOT NULL,
    estado          ENUM('PENDIENTE','PAGADO','ENVIADO','ENTREGADO','CANCELADO')
                    NOT NULL DEFAULT 'PENDIENTE',
    metodo_pago     ENUM('EFECTIVO','TRANSFERENCIA','TARJETA','PAYPAL','OTRO')
                    NOT NULL DEFAULT 'EFECTIVO',
    fecha_pedido    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notas           TEXT NULL,
    CONSTRAINT fk_pedido_cliente
        FOREIGN KEY (id_cliente) REFERENCES clientes(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_pedido_direccion
        FOREIGN KEY (id_direccion) REFERENCES direcciones_envio(id_direccion)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

---------------------------------------------------
-- 12) DETALLE DE PEDIDO
---------------------------------------------------
CREATE TABLE IF NOT EXISTS detalles_pedido (
    id_detalle      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_pedido       BIGINT UNSIGNED NOT NULL,
    id_producto     INT UNSIGNED NOT NULL,
    cantidad        INT UNSIGNED NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal        DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_detalle_pedido
        FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_detalle_producto
        FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;
