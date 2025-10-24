# راهنمای اجرای Migration

## مشکل فعلی
برنامه شما خطای زیر را نشان می‌دهد:
```
Unknown column 'card_title' in 'field list'
```

این به این معنی است که دیتابیس شما به‌روز نشده و ستون‌های جدید ندارد.

## راه حل (یکی از روش‌های زیر را انتخاب کنید)

### روش 1: استفاده از phpMyAdmin (ساده‌ترین روش)

1. مرورگر خود را باز کنید
2. به آدرس phpMyAdmin بروید (معمولاً یکی از این‌ها):
   - `http://localhost/phpmyadmin`
   - `http://localhost:8080/phpmyadmin`
   - `http://127.0.0.1/phpmyadmin`

3. از منوی سمت چپ، روی دیتابیس **bank_transactions** کلیک کنید

4. روی تب **SQL** (در بالای صفحه) کلیک کنید

5. **گزینه A**: فایل SQL را Import کنید
   - روی دکمه "Import" کلیک کنید
   - فایل `APPLY_MIGRATION.sql` را انتخاب کنید
   - دکمه "Go" را بزنید

   **یا گزینه B**: کد را مستقیماً paste کنید
   - این کد را در باکس SQL کپی کنید:

```sql
ALTER TABLE bank_cards
ADD COLUMN card_title VARCHAR(255) DEFAULT NULL AFTER card_holder_name,
ADD COLUMN cvv2 VARCHAR(4) DEFAULT NULL AFTER card_title,
ADD COLUMN sheba_number VARCHAR(26) DEFAULT NULL AFTER cvv2,
ADD COLUMN expiry_date VARCHAR(5) DEFAULT NULL AFTER sheba_number;

UPDATE bank_cards SET expiry_date = '08/29' WHERE expiry_date IS NULL;
```

6. دکمه **Go** یا **اجرا** را بزنید

7. باید پیام موفقیت‌آمیز ببینید (رنگ سبز)

### روش 2: استفاده از MySQL Workbench

1. MySQL Workbench را باز کنید
2. به connection خود متصل شوید:
   - Host: 127.0.0.1
   - Port: 8080
   - Username: root
   - Password: (رمز عبور خود)

3. روی دیتابیس `bank_transactions` دوبار کلیک کنید

4. از منوی File → Open SQL Script → فایل `APPLY_MIGRATION.sql` را انتخاب کنید

5. روی آیکون برق ⚡ (Execute) کلیک کنید

6. باید در پایین Output پیام موفقیت ببینید

### روش 3: اگر ابزار دیگری دارید

اگر از DBeaver، HeidiSQL، یا ابزار دیگری استفاده می‌کنید:
1. به دیتابیس `bank_transactions` متصل شوید
2. یک SQL Query window باز کنید
3. محتوای فایل `APPLY_MIGRATION.sql` را paste کنید
4. اجرا کنید

## بعد از اجرای Migration

1. صفحه مرورگر را Refresh کنید (F5)
2. به صفحه کارت‌های بانکی بروید
3. دکمه "افزودن کارت" را بزنید
4. فرم را پر کنید با فیلدهای جدید:
   - عنوان کارت (اختیاری)
   - شماره کارت (ضروری - 16 رقم)
   - CVV2 (اختیاری - 3 یا 4 رقم)
   - تاریخ انقضا (اختیاری - فرمت: MM/YY)
   - نام بانک (ضروری)
   - نام صاحب کارت (ضروری)
   - شماره شبا (اختیاری - 24 رقم بدون IR)

5. کارت باید با موفقیت اضافه شود! ✅

## اگر هنوز خطا دارید

اگر بعد از اجرای migration هنوز خطا می‌بینید:
1. مطمئن شوید که SQL با موفقیت اجرا شده (پیام سبز رنگ)
2. در phpMyAdmin روی جدول `bank_cards` کلیک کنید
3. روی تب "Structure" کلیک کنید
4. باید ستون‌های زیر را ببینید:
   - card_title
   - cvv2
   - sheba_number
   - expiry_date

اگر ستون‌ها را نمی‌بینید، یعنی SQL اجرا نشده است.

## نکته مهم

این migration فقط برای دیتابیس‌های موجود است. اگر دیتابیس را از ابتدا بسازید (با `database.sql`)، دیگر نیازی به این migration نیست چون `database.sql` حالا به‌روز شده است.
