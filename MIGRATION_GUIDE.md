# راهنمای Migration دیتابیس

## اضافه کردن فیلدهای جدید به جدول کارت‌های بانکی

برای اضافه کردن فیلدهای جدید (عنوان کارت، CVV2، شماره شبا، تاریخ انقضا) به جدول `bank_cards`، مراحل زیر را دنبال کنید:

### 1. اجرای فایل Migration

```bash
mysql -h 127.0.0.1 -P 8080 -u root -p < database_migration_add_card_fields.sql
```

یا می‌توانید دستورات را مستقیماً در MySQL اجرا کنید:

```sql
USE bank_transactions;

-- اضافه کردن فیلدهای جدید
ALTER TABLE bank_cards
ADD COLUMN card_title VARCHAR(255) DEFAULT NULL AFTER card_holder_name,
ADD COLUMN cvv2 VARCHAR(4) DEFAULT NULL AFTER card_title,
ADD COLUMN sheba_number VARCHAR(26) DEFAULT NULL AFTER cvv2,
ADD COLUMN expiry_date VARCHAR(5) DEFAULT NULL AFTER sheba_number;

-- به‌روزرسانی کارت‌های موجود با تاریخ انقضا پیش‌فرض
UPDATE bank_cards SET expiry_date = '08/29' WHERE expiry_date IS NULL;
```

### 2. فیلدهای جدید

| فیلد | نوع | توضیحات | الزامی |
|------|-----|---------|--------|
| `card_title` | VARCHAR(255) | عنوان دلخواه برای کارت (مثل "کارت اصلی") | خیر |
| `cvv2` | VARCHAR(4) | کد CVV2 (3 یا 4 رقم) | خیر |
| `sheba_number` | VARCHAR(26) | شماره شبا (24 رقم بدون IR) | خیر |
| `expiry_date` | VARCHAR(5) | تاریخ انقضا به فرمت MM/YY | خیر |

### 3. نمونه داده

```sql
INSERT INTO bank_cards (
    user_id,
    card_number,
    bank_name,
    card_holder_name,
    card_title,
    cvv2,
    sheba_number,
    expiry_date
) VALUES (
    1,
    '1234567812345678',
    'بانک ملی',
    'محمد احمدی',
    'کارت اصلی',
    '123',
    '123456789012345678901234',
    '08/29'
);
```

### 4. نکات مهم

- همه‌ی فیلدهای جدید اختیاری هستند (NULL مجاز است)
- شماره شبا باید بدون "IR" ذخیره شود (فقط 24 رقم)
- تاریخ انقضا باید به فرمت MM/YY باشد (مثال: 08/29)
- CVV2 می‌تواند 3 یا 4 رقم باشد
- کارت‌های قبلی به طور خودکار تاریخ انقضا پیش‌فرض دریافت می‌کنند

### 5. بازگشت به حالت قبل (Rollback)

اگر نیاز به حذف فیلدهای جدید دارید:

```sql
USE bank_transactions;

ALTER TABLE bank_cards
DROP COLUMN card_title,
DROP COLUMN cvv2,
DROP COLUMN sheba_number,
DROP COLUMN expiry_date;
```

### 6. بررسی موفقیت‌آمیز بودن Migration

```sql
DESCRIBE bank_cards;
```

خروجی باید شامل ستون‌های جدید باشد.
