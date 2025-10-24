# راهنمای راه‌اندازی بخش کارت‌های دوستان

## مرحله ۱: اجرای Migration دیتابیس

### روش ۱: استفاده از اسکریپت خودکار (پیشنهادی)

```bash
./run-friend-cards-migration.sh
```

### روش ۲: استفاده از MySQL Command Line

```bash
mysql -h 127.0.0.1 -P 8080 -u root -p bank_transactions < database_migration_friend_cards.sql
```

### روش ۳: اجرای دستی

```bash
mysql -h 127.0.0.1 -P 8080 -u root -p
```

سپس:

```sql
USE bank_transactions;

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
```

## مرحله ۲: بررسی ایجاد جدول

برای اطمینان از ایجاد صحیح جدول:

```sql
SHOW TABLES LIKE 'friend_cards';
DESCRIBE friend_cards;
```

## ویژگی‌های بخش کارت‌های دوستان

### API Endpoints

- **GET** `/api/friend-cards` - دریافت لیست کارت‌های دوستان
- **POST** `/api/friend-cards` - افزودن کارت دوست جدید
- **PUT** `/api/friend-cards/[id]` - ویرایش کارت دوست
- **DELETE** `/api/friend-cards/[id]` - حذف کارت دوست

### صفحات

- `/dashboard/friend-cards` - لیست کارت‌های دوستان
- `/dashboard/friend-cards/new` - افزودن کارت دوست جدید

### امکانات

1. **ذخیره اطلاعات کامل کارت**
   - عنوان کارت (برای شناسایی راحت‌تر)
   - شماره کارت 16 رقمی
   - شماره شبا 24 رقمی
   - توضیحات اختیاری

2. **امنیت**
   - نمایش مخفی شماره کارت و شبا
   - دکمه نمایش/مخفی کردن اطلاعات
   - کپی سریع شماره‌ها

3. **مدیریت**
   - افزودن کارت جدید
   - ویرایش کارت موجود
   - حذف کارت
   - جستجو و فیلتر (آماده برای توسعه)

## نکات امنیتی

- اطلاعات کارت‌ها فقط برای کاربر صاحب حساب قابل مشاهده است
- تمام درخواست‌های API نیاز به احراز هویت دارند
- Foreign key constraint برای جلوگیری از داده‌های یتیم
- Validation کامل برای شماره کارت و شبا

## نمونه استفاده

```typescript
// افزودن کارت دوست جدید
const response = await fetch('/api/friend-cards', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cardTitle: 'علی محمدی',
    cardNumber: '1234567890123456',
    shebaNumber: '012345678901234567890123',
    description: 'حساب شخصی'
  })
});
```
