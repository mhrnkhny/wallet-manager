-- Migration for Installment Payments table
-- اضافه کردن جدول پرداخت‌های اقساط

CREATE TABLE IF NOT EXISTS installment_payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  installment_id INT NOT NULL,
  payment_date DATE NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (installment_id) REFERENCES installments(id) ON DELETE CASCADE,
  INDEX idx_installment_id (installment_id),
  INDEX idx_payment_date (payment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
