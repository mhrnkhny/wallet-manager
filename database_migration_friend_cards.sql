-- Migration: Add friend_cards table
-- Date: 2025-10-24
-- Description: Create table for storing friends' bank card information

CREATE TABLE IF NOT EXISTS friend_cards (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  card_title VARCHAR(100) NOT NULL,
  card_number VARCHAR(16) NOT NULL,
  sheba_number VARCHAR(24) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_card_number (card_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add some helpful comments
ALTER TABLE friend_cards
  COMMENT 'Stores bank card information of friends for easy transfers';
