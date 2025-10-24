# راهنمای راه‌اندازی بخش اقساط

## مرحله ۱: اجرای Migration دیتابیس

### روش ۱: استفاده از اسکریپت خودکار (پیشنهادی)

```bash
chmod +x run-installments-migration.sh
./run-installments-migration.sh
```

### روش ۲: استفاده از MySQL Command Line

```bash
mysql -h 127.0.0.1 -P 8080 -u root -p bank_transactions < database_migration_installments.sql
```

### روش ۳: اجرای دستی

```bash
mysql -h 127.0.0.1 -P 8080 -u root -p
```

سپس:

```sql
USE bank_transactions;

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
```

## مرحله ۲: بررسی ایجاد جدول

برای اطمینان از ایجاد صحیح جدول:

```sql
SHOW TABLES LIKE 'installments';
DESCRIBE installments;
```

## ویژگی‌های بخش اقساط

### API Endpoints

- **GET** `/api/installments` - دریافت لیست اقساط
- **POST** `/api/installments` - افزودن قسط جدید
- **PUT** `/api/installments/[id]` - ویرایش قسط
- **DELETE** `/api/installments/[id]` - حذف قسط

### صفحات

- `/dashboard/installments` - لیست اقساط
- `/dashboard/installments/new` - افزودن قسط جدید
- `/dashboard/installments/edit/[id]` - ویرایش قسط

### امکانات

1. **ثبت اطلاعات کامل قسط**
   - عنوان قسط
   - تاریخ شروع و پایان (جلالی)
   - روز پرداخت در هر ماه (1-31)
   - مجموع کل مبلغ
   - مبلغ هر قسط ماهانه
   - توضیحات اختیاری

2. **نمایش اطلاعات**
   - محاسبه خودکار تعداد اقساط بر اساس تاریخ شروع و پایان
   - نمایش تاریخ‌ها به شمسی
   - نمایش مبالغ با فرمت فارسی

3. **مدیریت**
   - افزودن قسط جدید
   - ویرایش قسط موجود
   - حذف قسط با Modal تایید
   - جستجو در عنوان و توضیحات

4. **آمار و گزارش**
   - تعداد کل اقساط
   - مجموع کل مبالغ
   - مجموع پرداخت‌های ماهانه

## نکات امنیتی

- اطلاعات اقساط فقط برای کاربر صاحب حساب قابل مشاهده است
- تمام درخواست‌های API نیاز به احراز هویت دارند
- Foreign key constraint برای جلوگیری از داده‌های یتیم
- Validation کامل برای تاریخ‌ها و مبالغ
- Check constraints برای اعتبارسنجی داده‌ها در سطح دیتابیس

## نمونه استفاده

```typescript
// افزودن قسط جدید
const response = await fetch('/api/installments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    installmentTitle: 'قسط خودرو',
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    paymentDayOfMonth: 15,
    totalAmount: 60000000,
    installmentAmount: 2500000,
    description: 'قسط ماهانه خودرو پژو 207'
  })
});
```

## محاسبات

### تعداد اقساط
تعداد ماه‌های بین تاریخ شروع و پایان + 1

### مجموع ماهانه
جمع مبلغ هر قسط برای تمام اقساط فعال

### مجموع کل
جمع کل مبالغ تمام اقساط
