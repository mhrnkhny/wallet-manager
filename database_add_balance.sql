-- Add balance field to bank_cards table
ALTER TABLE bank_cards
ADD COLUMN balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00 AFTER sheba_number;

-- Add comment to the column
ALTER TABLE bank_cards
MODIFY COLUMN balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'موجودی فعلی کارت';

-- Show the updated table structure
DESCRIBE bank_cards;
