import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import moment from 'moment-jalaali';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();

    const [transactions]: any = await db.query(
      `SELECT
        t.id,
        t.transaction_type,
        t.amount,
        t.title,
        t.description,
        t.transaction_date,
        t.created_at,
        c.card_number,
        c.bank_name,
        c.card_holder_name
       FROM transactions t
       JOIN bank_cards c ON t.card_id = c.id
       WHERE t.user_id = ?
       ORDER BY t.transaction_date DESC, t.created_at DESC`,
      [session.userId]
    );

    // Convert Gregorian dates to Jalali and amount to number
    const transactionsWithJalali = transactions.map((t: any) => ({
      ...t,
      amount: parseFloat(t.amount),
      jalali_date: moment(t.transaction_date).format('jYYYY/jMM/jDD'),
    }));

    return NextResponse.json({ transactions: transactionsWithJalali });
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت تراکنش‌ها' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { cardId, transactionType, amount, title, description, jalaliDate } = await request.json();

    if (!cardId || !transactionType || !amount || !title || !jalaliDate) {
      return NextResponse.json(
        { error: 'لطفا تمام فیلدهای اجباری را پر کنید' },
        { status: 400 }
      );
    }

    // Validate transaction type
    if (!['deposit', 'withdrawal'].includes(transactionType)) {
      return NextResponse.json(
        { error: 'نوع تراکنش نامعتبر است' },
        { status: 400 }
      );
    }

    // Convert Jalali date to Gregorian
    const gregorianDate = moment(jalaliDate, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');

    // Verify card belongs to user and get current balance
    const [cards]: any = await db.query(
      'SELECT id, balance FROM bank_cards WHERE id = ? AND user_id = ?',
      [cardId, session.userId]
    );

    if (cards.length === 0) {
      return NextResponse.json(
        { error: 'کارت یافت نشد' },
        { status: 404 }
      );
    }

    const card = cards[0];
    const currentBalance = parseFloat(card.balance);
    const transactionAmount = parseFloat(amount);

    // Check if withdrawal amount exceeds balance
    if (transactionType === 'withdrawal' && transactionAmount > currentBalance) {
      return NextResponse.json(
        { error: `موجودی کافی نیست. موجودی فعلی: ${currentBalance.toLocaleString('fa-IR')} ریال` },
        { status: 400 }
      );
    }

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Insert transaction
      const [result]: any = await connection.query(
        'INSERT INTO transactions (user_id, card_id, transaction_type, amount, title, description, transaction_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [session.userId, cardId, transactionType, transactionAmount, title, description || null, gregorianDate]
      );

      // Update card balance
      const newBalance = transactionType === 'deposit'
        ? currentBalance + transactionAmount
        : currentBalance - transactionAmount;

      await connection.query(
        'UPDATE bank_cards SET balance = ? WHERE id = ?',
        [newBalance, cardId]
      );

      // Commit transaction
      await connection.commit();
      connection.release();

      return NextResponse.json({
        success: true,
        transaction: {
          id: result.insertId,
          cardId,
          transactionType,
          amount: transactionAmount,
          title,
          description,
          jalaliDate,
        },
        newBalance,
      });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (error) {
    console.error('Add transaction error:', error);
    return NextResponse.json(
      { error: 'خطا در افزودن تراکنش' },
      { status: 500 }
    );
  }
}
