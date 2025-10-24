-- Create database
CREATE DATABASE IF NOT EXISTS bank_transactions CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE bank_transactions;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bank cards table
CREATE TABLE IF NOT EXISTS bank_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    card_number VARCHAR(16) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    card_holder_name VARCHAR(255) NOT NULL,
    card_title VARCHAR(255) DEFAULT NULL,
    cvv2 VARCHAR(4) DEFAULT NULL,
    sheba_number VARCHAR(26) DEFAULT NULL,
    expiry_date VARCHAR(5) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    card_id INT NOT NULL,
    transaction_type ENUM('deposit', 'withdrawal') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES bank_cards(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_card_id (card_id),
    INDEX idx_transaction_date (transaction_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
