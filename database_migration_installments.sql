-- Migration for Installments table
-- اضافه کردن جدول اقساط

CREATE TABLE IF NOT EXISTS installments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  installment_title VARCHAR(200) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  payment_day_of_month INT NOT NULL,
  total_amount DECIMAL(15, 2) NOT NULL,
  installment_amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_start_date (start_date),
  INDEX idx_end_date (end_date),
  CONSTRAINT chk_payment_day CHECK (payment_day_of_month BETWEEN 1 AND 31),
  CONSTRAINT chk_dates CHECK (end_date >= start_date),
  CONSTRAINT chk_amounts CHECK (total_amount > 0 AND installment_amount > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
