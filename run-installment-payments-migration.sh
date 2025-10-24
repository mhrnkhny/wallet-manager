#!/bin/bash

# Installment Payments Migration Script
# این اسکریپت جدول installment_payments را در دیتابیس ایجاد می‌کند

echo "🚀 در حال اجرای migration برای جدول installment_payments..."
echo ""

# رنگ‌ها برای خروجی
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# بررسی وجود mysql
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ mysql command یافت نشد!${NC}"
    echo ""
    echo -e "${YELLOW}لطفاً به صورت دستی SQL زیر را اجرا کنید:${NC}"
    echo ""
    cat database_migration_installment_payments.sql
    exit 1
fi

# اطلاعات دیتابیس
DB_HOST="127.0.0.1"
DB_PORT="8080"
DB_USER="root"
DB_NAME="bank_transactions"

# درخواست رمز عبور
echo -e "${YELLOW}لطفاً رمز عبور MySQL را وارد کنید:${NC}"
read -s DB_PASS
echo ""

# اجرای migration
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS $DB_NAME < database_migration_installment_payments.sql

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Migration با موفقیت اجرا شد!${NC}"
    echo ""
    echo "برای بررسی، این دستور را اجرا کنید:"
    echo "mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p $DB_NAME -e \"DESCRIBE installment_payments;\""
else
    echo ""
    echo -e "${RED}❌ خطا در اجرای migration!${NC}"
    echo ""
    echo -e "${YELLOW}لطفاً به صورت دستی SQL زیر را اجرا کنید:${NC}"
    echo ""
    cat database_migration_installment_payments.sql
    exit 1
fi
