-- Migration to add new fields to bank_cards table
USE bank_transactions;

-- Add new columns to bank_cards table
ALTER TABLE bank_cards
ADD COLUMN card_title VARCHAR(255) DEFAULT NULL AFTER card_holder_name,
ADD COLUMN cvv2 VARCHAR(4) DEFAULT NULL AFTER card_title,
ADD COLUMN sheba_number VARCHAR(26) DEFAULT NULL AFTER cvv2,
ADD COLUMN expiry_date VARCHAR(5) DEFAULT NULL AFTER sheba_number;

-- Update existing cards with default expiry date if needed
UPDATE bank_cards SET expiry_date = '08/29' WHERE expiry_date IS NULL;
