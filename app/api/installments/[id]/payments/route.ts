import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import moment from 'moment-jalaali';

// GET all payments for a specific installment
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const installmentId = parseInt(id);

    if (isNaN(installmentId)) {
      return NextResponse.json(
        { error: 'شناسه قسط نامعتبر است' },
        { status: 400 }
      );
    }

    // Check if installment belongs to user
    const [installments]: any = await db.query(
      'SELECT id FROM installments WHERE id = ? AND user_id = ?',
      [installmentId, user.userId]
    );

    if (installments.length === 0) {
      return NextResponse.json(
        { error: 'قسط یافت نشد' },
        { status: 404 }
      );
    }

    // Get all payments for this installment
    const [payments]: any = await db.query(
      `SELECT id, installment_id,
              DATE_FORMAT(payment_date, '%Y-%m-%d') as payment_date,
              amount, note,
              DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
       FROM installment_payments
       WHERE installment_id = ?
       ORDER BY payment_date DESC`,
      [installmentId]
    );

    // Convert amount to number
    const paymentsWithNumbers = payments.map((payment: any) => ({
      ...payment,
      amount: parseFloat(payment.amount),
    }));

    return NextResponse.json({ payments: paymentsWithNumbers });
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: error.message || 'خطا در دریافت پرداخت‌ها' },
      { status: error.message.includes('وارد') ? 401 : 500 }
    );
  }
}

// POST create new payment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const installmentId = parseInt(id);
    const body = await req.json();
    const { paymentDate, amount, note, cardId } = body;

    if (isNaN(installmentId)) {
      return NextResponse.json(
        { error: 'شناسه قسط نامعتبر است' },
        { status: 400 }
      );
    }

    // Check if installment belongs to user and get installment title
    const [installments]: any = await db.query(
      'SELECT id, installment_title FROM installments WHERE id = ? AND user_id = ?',
      [installmentId, user.userId]
    );

    if (installments.length === 0) {
      return NextResponse.json(
        { error: 'قسط یافت نشد' },
        { status: 404 }
      );
    }

    const installmentTitle = installments[0].installment_title;

    // Validation
    if (!paymentDate) {
      return NextResponse.json(
        { error: 'تاریخ پرداخت الزامی است' },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'مبلغ باید بیشتر از صفر باشد' },
        { status: 400 }
      );
    }

    if (!cardId) {
      return NextResponse.json(
        { error: 'انتخاب کارت بانکی الزامی است' },
        { status: 400 }
      );
    }

    // Verify card belongs to user and get current balance
    const [cards]: any = await db.query(
      'SELECT id, balance FROM bank_cards WHERE id = ? AND user_id = ?',
      [cardId, user.userId]
    );

    if (cards.length === 0) {
      return NextResponse.json(
        { error: 'کارت یافت نشد' },
        { status: 404 }
      );
    }

    const card = cards[0];
    const currentBalance = parseFloat(card.balance);
    const paymentAmount = parseFloat(amount);

    // Check if payment amount exceeds balance
    if (paymentAmount > currentBalance) {
      return NextResponse.json(
        { error: `موجودی کافی نیست. موجودی فعلی: ${currentBalance.toLocaleString('fa-IR')} ریال` },
        { status: 400 }
      );
    }

    // Start database transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Insert payment record
      await connection.query(
        `INSERT INTO installment_payments
         (installment_id, payment_date, amount, note)
         VALUES (?, ?, ?, ?)`,
        [installmentId, paymentDate, paymentAmount, note?.trim() || null]
      );

      // Create withdrawal transaction with title
      const transactionTitle = `پرداخت قسط: ${installmentTitle}`;
      await connection.query(
        `INSERT INTO transactions
         (user_id, card_id, transaction_type, amount, title, description, transaction_date)
         VALUES (?, ?, 'withdrawal', ?, ?, ?, ?)`,
        [user.userId, cardId, paymentAmount, transactionTitle, note?.trim() || null, paymentDate]
      );

      // Update card balance
      const newBalance = currentBalance - paymentAmount;
      await connection.query(
        'UPDATE bank_cards SET balance = ? WHERE id = ?',
        [newBalance, cardId]
      );

      // Commit transaction
      await connection.commit();
      connection.release();

      return NextResponse.json({
        message: 'پرداخت با موفقیت ثبت شد',
        newBalance,
      });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (error: any) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: error.message || 'خطا در ثبت پرداخت' },
      { status: error.message.includes('وارد') ? 401 : 500 }
    );
  }
}
