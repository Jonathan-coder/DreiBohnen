-- Datenbank für den Webshop "Dreibohnen"
CREATE DATABASE IF NOT EXISTS `dreibohnen` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `dreibohnen`;

-- Tabelle für Kategorien
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- Tabelle für Produkte
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10, 2) NOT NULL,
  `image` VARCHAR(255) DEFAULT 'default.png',
  `rating` INT DEFAULT 5,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabelle für Benutzer
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `salutation` VARCHAR(20) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `street` VARCHAR(255) NOT NULL,
  `zip` VARCHAR(20) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `payment_info` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'user',
  `remember_token` VARCHAR(128) DEFAULT NULL,
  `remember_expiry` INT DEFAULT NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Testdaten für Sprint 1
INSERT INTO `categories` (`id`, `name`) VALUES 
(1, 'Kaffeebohnen'), 
(2, 'Zubehör');

INSERT INTO `products` (`category_id`, `name`, `description`, `price`, `image`, `rating`) VALUES 
(1, 'Äthiopien Sidamo', 'Mild und fruchtig mit Zitrusnoten.', 14.90, 'testpic.png', 5),
(1, 'Espresso Siciliano', 'Kräftig, dunkel geröstet.', 12.50, 'testpic.png', 4),
(2, 'Hario V60 Filter', 'Klassischer Handfilter.', 19.00, 'testpic.png', 5);