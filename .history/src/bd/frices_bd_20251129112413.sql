-- =========================================================
-- Accesorios Frices: creación de base y tabla "clientes"
-- Compatible con MySQL 8.x y MariaDB
-- =========================================================

-- 1) Crear base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS `AccesoriosFrices`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

-- 2) Usar la base
USE `AccesoriosFrices`;

-- 3) Crear usuario del proyecto
--    Este usuario es el mismo que se usa en el archivo .env
CREATE USER 'Frida'@'localhost'
  IDENTIFIED BY 'frices25';

-- 4) Otorgar permisos al usuario sobre la base de datos del proyecto
GRANT ALL PRIVILEGES ON `AccesoriosFrices`.*
  TO 'Frida'@'localhost';

FLUSH PRIVILEGES;

-- 5) Crear tabla clientes (si no existe)
CREATE TABLE IF NOT EXISTS `clientes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(120) NOT NULL,
  `email` VARCHAR(160) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_clientes_email` (`email`),
  KEY `idx_clientes_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `clientes` (nombre, email, password_hash, activo)
VALUES (
  'Cliente Demo',
  'fernando@hotmail.com',
  '$2b$10$uxN3uzuoAwWGEGjcDyR4h..JaW0iopIO2FZ19G8CtSzoqh2NmWUYW',
  1
);

CREATE TABLE IF NOT EXISTS direcciones_envio (
    id_direccion     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_cliente       BIGINT UNSIGNED NOT NULL,
    calle            VARCHAR(150) NOT NULL,
    num_exterior     VARCHAR(20),
    num_interior     VARCHAR(20),
    colonia          VARCHAR(100),
    ciudad           VARCHAR(100),
    estado           VARCHAR(100),
    codigo_postal    VARCHAR(10),
    pais             VARCHAR(100) DEFAULT 'México',
    es_principal     TINYINT(1) NOT NULL DEFAULT 0,
    CONSTRAINT fk_direccion_cliente
        FOREIGN KEY (id_cliente) REFERENCES clientes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

---------------------------------------------------
-- 6) CATEGORÍAS (Aretes, Collares, Sets, etc.)
---------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre           VARCHAR(100) NOT NULL UNIQUE,
    descripcion      VARCHAR(255),
    imagen_url       VARCHAR(255),
    orden            INT UNSIGNED NOT NULL DEFAULT 0,
    activo           TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

---------------------------------------------------
-- 7) PRODUCTOS (SIN MARCAS)
---------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
    id_producto          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre               VARCHAR(150) NOT NULL,
    modelo               VARCHAR(50) NOT NULL,
    sku                  VARCHAR(50) NOT NULL UNIQUE,
    descripcion_corta    VARCHAR(255),
    descripcion_larga    TEXT,
    precio               DECIMAL(10,2) NOT NULL,
    cantidad             INT UNSIGNED NOT NULL DEFAULT 0,
    id_categoria         INT UNSIGNED NOT NULL,
    activo               TINYINT(1) NOT NULL DEFAULT 1,
    fecha_alta           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

---------------------------------------------------
-- 8) IMÁGENES DE PRODUCTO
---------------------------------------------------
CREATE TABLE IF NOT EXISTS imagenes_producto (
    id_imagen        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_producto      INT UNSIGNED NOT NULL,
    url_imagen       VARCHAR(255) NOT NULL,
    es_principal     TINYINT(1) NOT NULL DEFAULT 0,
    CONSTRAINT fk_imagen_producto
        FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

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
