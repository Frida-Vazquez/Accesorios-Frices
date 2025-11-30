-- =========================================================
-- Accesorios Frices - DB básica para login + catálogos
-- Tablas: clientes, roles, cliente_roles, direcciones,
--         categorias, productos
-- =========================================================

CREATE DATABASE IF NOT EXISTS `AccesoriosFrices`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `AccesoriosFrices`;

-- (Opcional) usuario para tu app
CREATE USER IF NOT EXISTS 'Frida'@'localhost'
  IDENTIFIED BY 'frices25';

GRANT ALL PRIVILEGES ON `AccesoriosFrices`.*
  TO 'Frida'@'localhost';

FLUSH PRIVILEGES;
-- =========================================================
-- LIMPIAR TABLAS VIEJAS
-- =========================================================
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS
  pedido_items,
  pagos,
  carrito_items,
  carritos,
  pedidos,
  imagenes_producto,
  direcciones_envio,
  productos,
  categorias,
  direcciones,
  cliente_roles,
  roles,
  clientes;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- 1) CLIENTES
-- =========================================================
CREATE TABLE `clientes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(120) NOT NULL,
  `email` VARCHAR(160) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
               ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_clientes_email` (`email`),
  KEY `idx_clientes_created_at` (`created_at`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;

-- =========================================================
-- 2) ROLES + CLIENTE_ROLES
-- =========================================================
CREATE TABLE `roles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `descripcion` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_roles_nombre` (`nombre`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;

CREATE TABLE `cliente_roles` (
  `cliente_id` BIGINT UNSIGNED NOT NULL,
  `rol_id` BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`cliente_id`, `rol_id`),
  CONSTRAINT `fk_cliente_roles_cliente`
    FOREIGN KEY (`cliente_id`)
    REFERENCES `clientes` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_cliente_roles_rol`
    FOREIGN KEY (`rol_id`)
    REFERENCES `roles` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;

-- Roles base
INSERT INTO `roles` (nombre, descripcion) VALUES
('ADMIN', 'Administrador del sistema y catálogo'),
('CLIENTE', 'Cliente de la tienda Accesorios Frices')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

-- Admin inicial (password: 12345678)
INSERT INTO `clientes` (nombre, email, password_hash, activo)
VALUES (
  'Admin Accesorios Frices',
  'admin@accesoriosfrices.com',
  '$2b$10$uxN3uzuoAwWGEGjcDyR4h..JaW0iopIO2FZ19G8CtSzoqh2NmWUYW',
  1
)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

INSERT INTO `cliente_roles` (cliente_id, rol_id)
SELECT c.id, r.id
FROM clientes c, roles r
WHERE c.email = 'admin@accesoriosfrices.com'
  AND r.nombre = 'ADMIN'
ON DUPLICATE KEY UPDATE cliente_id = cliente_id;

-- =========================================================
-- 3) DIRECCIONES
-- =========================================================
CREATE TABLE `direcciones` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cliente_id` BIGINT UNSIGNED NOT NULL,
  `alias` VARCHAR(50) DEFAULT NULL,
  `calle` VARCHAR(150) NOT NULL,
  `numero_ext` VARCHAR(20) NOT NULL,
  `numero_int` VARCHAR(20) DEFAULT NULL,
  `colonia` VARCHAR(150) NOT NULL,
  `ciudad` VARCHAR(100) NOT NULL,
  `estado` VARCHAR(100) NOT NULL,
  `cp` VARCHAR(10) NOT NULL,
  `referencia` VARCHAR(255) DEFAULT NULL,
  `es_principal` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
               ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_direcciones_cliente_id` (`cliente_id`),
  CONSTRAINT `fk_direcciones_clientes`
    FOREIGN KEY (`cliente_id`)
    REFERENCES `clientes` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;

-- =========================================================
-- 4) CATEGORÍAS
-- =========================================================
CREATE TABLE `categorias` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` VARCHAR(255) DEFAULT NULL,
  `activa` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
               ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_categorias_nombre` (`nombre`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;

INSERT INTO `categorias` (nombre, descripcion) VALUES
('ARETES',   'Aretes y arracadas'),
('CADENAS',  'Cadenas y collares'),
('ANILLOS',  'Anillos ajustables y de medida'),
('PULSERAS', 'Pulseras y brazaletes'),
('SETS',     'Juegos combinados de joyería')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

-- =========================================================
-- 5) PRODUCTOS
-- =========================================================
CREATE TABLE `productos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `categoria_id` BIGINT UNSIGNED NOT NULL,

  `nombre` VARCHAR(150) NOT NULL,
  `descripcion` TEXT,
  `precio` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `url_imagen` VARCHAR(255) DEFAULT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,

  `tipo_pieza` VARCHAR(20) NOT NULL DEFAULT 'OTRO',
  `material` VARCHAR(100) DEFAULT NULL,
  `color_principal` VARCHAR(50) DEFAULT NULL,
  `es_hipoalergenico` TINYINT(1) NOT NULL DEFAULT 0,
  `es_ajustable` TINYINT(1) NOT NULL DEFAULT 0,
  `largo_cm` DECIMAL(5,2) DEFAULT NULL,

  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
               ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  KEY `idx_productos_categoria_id` (`categoria_id`),
  CONSTRAINT `fk_productos_categorias`
    FOREIGN KEY (`categoria_id`)
    REFERENCES `categorias` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;


