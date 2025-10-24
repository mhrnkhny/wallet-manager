import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET all installments for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    const [installments]: any = await db.query(
      `SELECT i.id, i.installment_title,
              DATE_FORMAT(i.start_date, '%Y-%m-%d') as start_date,
              DATE_FORMAT(i.end_date, '%Y-%m-%d') as end_date,
              i.payment_day_of_month,
              i.total_amount, i.installment_amount, i.description,
              i.created_at, i.updated_at,
              COUNT(p.id) as paid_count,
              COALESCE(SUM(p.amount), 0) as total_paid
       FROM installments i
       LEFT JOIN installment_payments p ON i.id = p.installment_id
       WHERE i.user_id = ?
       GROUP BY i.id
       ORDER BY i.start_date DESC`,
      [user.userId]
    );

    // Convert numeric fields to numbers
    const installmentsWithNumbers = installments.map((inst: any) => ({
      ...inst,
      total_amount: parseFloat(inst.total_amount),
      installment_amount: parseFloat(inst.installment_amount),
      total_paid: parseFloat(inst.total_paid),
    }));

    return NextResponse.json({ installments: installmentsWithNumbers });
  } catch (error: any) {
    console.error('Error fetching installments:', error);
    return NextResponse.json(
      { error: error.message || 'خطا در دریافت اقساط' },
      { status: error.message.includes('وارد') ? 401 : 500 }
    );
  }
}

// POST create new installment
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const {
      installmentTitle,
      startDate,
      endDate,
      paymentDayOfMonth,
      totalAmount,
      installmentAmount,
      description,
    } = body;

    // Validation
    if (!installmentTitle || !installmentTitle.trim()) {
      return NextResponse.json(
        { error: 'عنوان قسط الزامی است' },
        { status: 400 }
      );
    }

    if (!startDate) {
      return NextResponse.json(
        { error: 'تاریخ شروع الزامی است' },
        { status: 400 }
      );
    }

    if (!endDate) {
      return NextResponse.json(
        { error: 'تاریخ پایان الزامی است' },
        { status: 400 }
      );
    }

    if (!paymentDayOfMonth || paymentDayOfMonth < 1 || paymentDayOfMonth > 31) {
      return NextResponse.json(
        { error: 'روز پرداخت باید بین 1 تا 31 باشد' },
        { status: 400 }
      );
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: 'مجموع کل باید بیشتر از صفر باشد' },
        { status: 400 }
      );
    }

    if (!installmentAmount || installmentAmount <= 0) {
      return NextResponse.json(
        { error: 'مبلغ هر قسط باید بیشتر از صفر باشد' },
        { status: 400 }
      );
    }

    // Insert installment
    await db.query(
      `INSERT INTO installments
       (user_id, installment_title, start_date, end_date, payment_day_of_month,
        total_amount, installment_amount, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.userId,
        installmentTitle.trim(),
        startDate,
        endDate,
        paymentDayOfMonth,
        totalAmount,
        installmentAmount,
        description?.trim() || null,
      ]
    );

    return NextResponse.json({
      message: 'قسط با موفقیت ایجاد شد',
    });
  } catch (error: any) {
    console.error('Error creating installment:', error);
    return NextResponse.json(
      { error: error.message || 'خطا در ایجاد قسط' },
      { status: error.message.includes('وارد') ? 401 : 500 }
    );
  }
}
