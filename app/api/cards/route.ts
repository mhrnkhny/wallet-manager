import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();

    const [cards]: any = await db.query(
      'SELECT id, card_number, bank_name, card_holder_name, card_title, cvv2, sheba_number, balance, expiry_date, created_at FROM bank_cards WHERE user_id = ? ORDER BY created_at DESC',
      [session.userId]
    );

    // Convert balance to number
    const cardsWithNumericBalance = cards.map((card: any) => ({
      ...card,
      balance: parseFloat(card.balance),
    }));

    return NextResponse.json({ cards: cardsWithNumericBalance });
  } catch (error) {
    console.error('Get cards error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت کارت‌ها' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { cardNumber, bankName, cardHolderName, cardTitle, cvv2, shebaNumber, expiryDate, initialBalance } = await request.json();

    if (!cardNumber || !bankName || !cardHolderName) {
      return NextResponse.json(
        { error: 'لطفا فیلدهای ضروری را پر کنید' },
        { status: 400 }
      );
    }

    // Validate card number (16 digits)
    if (!/^\d{16}$/.test(cardNumber)) {
      return NextResponse.json(
        { error: 'شماره کارت باید 16 رقم باشد' },
        { status: 400 }
      );
    }

    // Validate CVV2 if provided
    if (cvv2 && !/^\d{3,4}$/.test(cvv2)) {
      return NextResponse.json(
        { error: 'CVV2 باید 3 یا 4 رقم باشد' },
        { status: 400 }
      );
    }

    // Validate Sheba number if provided
    if (shebaNumber && !/^\d{24}$/.test(shebaNumber)) {
      return NextResponse.json(
        { error: 'شماره شبا باید 24 رقم باشد' },
        { status: 400 }
      );
    }

    // Validate expiry date if provided
    if (expiryDate && !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      return NextResponse.json(
        { error: 'فرمت تاریخ انقضا نادرست است (MM/YY)' },
        { status: 400 }
      );
    }

    const balance = initialBalance !== undefined && initialBalance !== null ? parseFloat(initialBalance) : 0;

    const [result]: any = await db.query(
      'INSERT INTO bank_cards (user_id, card_number, bank_name, card_holder_name, card_title, cvv2, sheba_number, balance, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [session.userId, cardNumber, bankName, cardHolderName, cardTitle || null, cvv2 || null, shebaNumber || null, balance, expiryDate || null]
    );

    return NextResponse.json({
      success: true,
      card: {
        id: result.insertId,
        cardNumber,
        bankName,
        cardHolderName,
        cardTitle,
        cvv2,
        shebaNumber,
        expiryDate,
      },
    });
  } catch (error) {
    console.error('Add card error:', error);
    return NextResponse.json(
      { error: 'خطا در افزودن کارت' },
      { status: 500 }
    );
  }
}
