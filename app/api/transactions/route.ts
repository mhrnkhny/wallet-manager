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

    // Convert Gregorian dates to Jalali
    const transactionsWithJalali = transactions.map((t: any) => ({
      ...t,
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

    // Verify card belongs to user
    const [cards]: any = await db.query(
      'SELECT id FROM bank_cards WHERE id = ? AND user_id = ?',
      [cardId, session.userId]
    );

    if (cards.length === 0) {
      return NextResponse.json(
        { error: 'کارت یافت نشد' },
        { status: 404 }
      );
    }

    const [result]: any = await db.query(
      'INSERT INTO transactions (user_id, card_id, transaction_type, amount, title, description, transaction_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [session.userId, cardId, transactionType, amount, title, description || null, gregorianDate]
    );

    return NextResponse.json({
      success: true,
      transaction: {
        id: result.insertId,
        cardId,
        transactionType,
        amount,
        title,
        description,
        jalaliDate,
      },
    });
  } catch (error) {
    console.error('Add transaction error:', error);
    return NextResponse.json(
      { error: 'خطا در افزودن تراکنش' },
      { status: 500 }
    );
  }
}
