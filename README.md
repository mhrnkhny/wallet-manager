# سیستم مدیریت تراکنش‌های بانکی

یک پروژه کامل مدیریت تراکنش‌های بانکی با Next.js، TypeScript، و MySQL

## ویژگی‌ها

- ✅ سیستم احراز هویت کامل (ثبت‌نام، ورود، خروج)
- 💳 مدیریت کارت‌های بانکی (افزودن، نمایش، حذف)
- 💰 ثبت و مدیریت تراکنش‌های بانکی (واریز/برداشت)
- 📅 پشتیبانی از تاریخ جلالی (شمسی)
- 🎨 رابط کاربری فارسی و زیبا با Tailwind CSS
- 🔒 امنیت بالا با JWT و bcrypt
- 🗄️ دیتابیس MySQL

## تکنولوژی‌های استفاده شده

- **Frontend & Backend**: Next.js 16 (App Router)
- **زبان**: TypeScript
- **دیتابیس**: MySQL
- **استایل**: Tailwind CSS
- **احراز هویت**: JWT (jose)
- **هش رمز عبور**: bcryptjs
- **تاریخ جلالی**: moment-jalaali

## نصب و راه‌اندازی

### 1. نصب وابستگی‌ها

```bash
npm install
```

### 2. راه‌اندازی دیتابیس MySQL

ابتدا MySQL Server را روی پورت 8080 راه‌اندازی کنید، سپس:

```bash
mysql -h 127.0.0.1 -P 8080 -u root -p < database.sql
```

یا می‌توانید محتوای فایل `database.sql` را مستقیماً در MySQL اجرا کنید.

### 3. تنظیم متغیرهای محیطی

فایل `.env.local` را ویرایش کرده و اطلاعات دیتابیس خود را وارد کنید:

```env
DB_HOST=127.0.0.1
DB_PORT=8080
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bank_transactions

JWT_SECRET=your-secret-key-change-this-in-production
```

### 4. اجرای پروژه

```bash
npm run dev
```

پروژه روی آدرس [http://localhost:3000](http://localhost:3000) اجرا خواهد شد.

## ساختار دیتابیس

### جدول users
- id (Primary Key)
- email (Unique)
- password (Hashed)
- name
- created_at
- updated_at

### جدول bank_cards
- id (Primary Key)
- user_id (Foreign Key)
- card_number (16 digits)
- bank_name
- card_holder_name
- created_at
- updated_at

### جدول transactions
- id (Primary Key)
- user_id (Foreign Key)
- card_id (Foreign Key)
- transaction_type (deposit/withdrawal)
- amount
- title
- description
- transaction_date
- created_at
- updated_at

## نحوه استفاده

1. **ثبت‌نام**: به `/register` بروید و حساب کاربری جدید ایجاد کنید
2. **ورود**: با ایمیل و رمز عبور وارد شوید
3. **افزودن کارت**: از منوی "کارت‌های بانکی" کارت‌های خود را اضافه کنید
4. **ثبت تراکنش**: از منوی "تراکنش‌ها" تراکنش جدید اضافه کنید:
   - انتخاب کارت بانکی
   - نوع تراکنش (واریز یا برداشت)
   - مبلغ (ریال)
   - عنوان تراکنش
   - توضیحات (اختیاری)
   - تاریخ جلالی

5. **مشاهده لیست**: تمام تراکنش‌ها و کارت‌های خود را مشاهده کنید

## API Endpoints

### احراز هویت
- `POST /api/auth/register` - ثبت‌نام
- `POST /api/auth/login` - ورود
- `POST /api/auth/logout` - خروج

### کارت‌های بانکی
- `GET /api/cards` - دریافت لیست کارت‌ها
- `POST /api/cards` - افزودن کارت جدید
- `DELETE /api/cards/[id]` - حذف کارت

### تراکنش‌ها
- `GET /api/transactions` - دریافت لیست تراکنش‌ها
- `POST /api/transactions` - افزودن تراکنش جدید
- `DELETE /api/transactions/[id]` - حذف تراکنش

## بیلد برای Production

```bash
npm run build
npm start
```

## توضیحات بیشتر

برای اطلاعات بیشتر به فایل `SETUP.md` مراجعه کنید.
