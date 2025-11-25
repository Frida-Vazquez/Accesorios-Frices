-- =========================================================
-- Accesorios Frices: creación de base y tabla "clientes"
-- Compatible con MySQL 8.x y MariaDB
-- =========================================================

-- 1) Crear base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS `frices_db`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

-- 2) Usar la base
USE `frices_db`;

-- 3) Crear tabla clientes (si no existe)
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
