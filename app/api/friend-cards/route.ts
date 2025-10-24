import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET all friend cards for authenticated user
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    const [friendCards]: any = await db.query(
      `SELECT
        id,
        card_title,
        card_number,
        sheba_number,
        description,
        created_at,
        updated_at
      FROM friend_cards
      WHERE user_id = ?
      ORDER BY created_at DESC`,
      [user.userId]
    );

    return NextResponse.json({ friendCards });
  } catch (error: any) {
    console.error('Error fetching friend cards:', error);
    return NextResponse.json(
      { error: error.message || 'خطا در دریافت کارت‌های دوستان' },
      { status: error.message.includes('وارد') ? 401 : 500 }
    );
  }
}

// POST create new friend card
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { cardTitle, cardNumber, shebaNumber, description } = body;

    // Validation
    if (!cardTitle || !cardTitle.trim()) {
      return NextResponse.json(
        { error: 'عنوان کارت الزامی است' },
        { status: 400 }
      );
    }

    if (!cardNumber || !/^\d{16}$/.test(cardNumber)) {
      return NextResponse.json(
        { error: 'شماره کارت باید 16 رقم باشد' },
        { status: 400 }
      );
    }

    if (!shebaNumber || !/^(IR)?\d{24}$/.test(shebaNumber.replace(/IR/i, ''))) {
      return NextResponse.json(
        { error: 'شماره شبا باید 24 رقم باشد' },
        { status: 400 }
      );
    }

    // Normalize sheba number (remove IR prefix if exists and add it back)
    const normalizedSheba = shebaNumber.replace(/IR/i, '');
    const formattedSheba = `IR${normalizedSheba}`;

    // Insert friend card
    const [result]: any = await db.query(
      `INSERT INTO friend_cards (user_id, card_title, card_number, sheba_number, description)
       VALUES (?, ?, ?, ?, ?)`,
      [user.userId, cardTitle.trim(), cardNumber, formattedSheba, description?.trim() || null]
    );

    return NextResponse.json({
      message: 'کارت دوست با موفقیت اضافه شد',
      friendCard: {
        id: result.insertId,
        card_title: cardTitle.trim(),
        card_number: cardNumber,
        sheba_number: formattedSheba,
        description: description?.trim() || null,
      },
    });
  } catch (error: any) {
    console.error('Error creating friend card:', error);
    return NextResponse.json(
      { error: error.message || 'خطا در افزودن کارت دوست' },
      { status: error.message.includes('وارد') ? 401 : 500 }
    );
  }
}
