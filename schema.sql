-- Item & Purchase Management System - MySQL schema (MySQL 8.0+)
-- Run:  mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS item_purchase_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE item_purchase_db;

DROP TABLE IF EXISTS purchase_items;
DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS item_types;

CREATE TABLE item_types (
  id        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  type_name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_item_types_name (type_name)
) ENGINE=InnoDB;

CREATE TABLE items (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name            VARCHAR(150) NOT NULL,
  purchase_date   DATE NOT NULL,
  stock_available INT UNSIGNED NOT NULL DEFAULT 0,   -- UNSIGNED: DB itself refuses negative stock
  item_type_id    INT UNSIGNED NOT NULL,
  active          TINYINT(1) NOT NULL DEFAULT 1,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_items_type (item_type_id),
  CONSTRAINT fk_items_type FOREIGN KEY (item_type_id)
    REFERENCES item_types (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE purchases (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id      VARCHAR(30) NOT NULL,
  purchase_date DATE NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_purchases_order_id (order_id)
) ENGINE=InnoDB;

CREATE TABLE purchase_items (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  purchase_id INT UNSIGNED NOT NULL,
  item_id     INT UNSIGNED NOT NULL,
  quantity    INT UNSIGNED NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_purchase_item (purchase_id, item_id),   -- no duplicate item within one order
  KEY idx_pi_item (item_id),
  -- RESTRICT on both: items used in history cannot be deleted; purchases cannot be cascade-deleted
  CONSTRAINT fk_pi_purchase FOREIGN KEY (purchase_id)
    REFERENCES purchases (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_pi_item FOREIGN KEY (item_id)
    REFERENCES items (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_pi_qty CHECK (quantity > 0)
) ENGINE=InnoDB;
