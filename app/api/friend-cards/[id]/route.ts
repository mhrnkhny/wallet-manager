import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// DELETE friend card by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const friendCardId = parseInt(id);

    if (isNaN(friendCardId)) {
      return NextResponse.json(
        { error: 'شناسه کارت نامعتبر است' },
        { status: 400 }
      );
    }

    // Check if friend card exists and belongs to user
    const [friendCards]: any = await db.query(
      'SELECT id FROM friend_cards WHERE id = ? AND user_id = ?',
      [friendCardId, user.userId]
    );

    if (friendCards.length === 0) {
      return NextResponse.json(
        { error: 'کارت دوست یافت نشد' },
        { status: 404 }
      );
    }

    // Delete friend card
    await db.query('DELETE FROM friend_cards WHERE id = ?', [friendCardId]);

    return NextResponse.json({
      message: 'کارت دوست با موفقیت حذف شد',
    });
  } catch (error: any) {
    console.error('Error deleting friend card:', error);
    return NextResponse.json(
      { error: error.message || 'خطا در حذف کارت دوست' },
      { status: error.message.includes('وارد') ? 401 : 500 }
    );
  }
}

// PUT update friend card
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const friendCardId = parseInt(id);
    const body = await req.json();
    const { cardTitle, cardNumber, shebaNumber, description } = body;

    if (isNaN(friendCardId)) {
      return NextResponse.json(
        { error: 'شناسه کارت نامعتبر است' },
        { status: 400 }
      );
    }

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

    // Check if friend card exists and belongs to user
    const [friendCards]: any = await db.query(
      'SELECT id FROM friend_cards WHERE id = ? AND user_id = ?',
      [friendCardId, user.userId]
    );

    if (friendCards.length === 0) {
      return NextResponse.json(
        { error: 'کارت دوست یافت نشد' },
        { status: 404 }
      );
    }

    // Normalize sheba number
    const normalizedSheba = shebaNumber.replace(/IR/i, '');
    const formattedSheba = `IR${normalizedSheba}`;

    // Update friend card
    await db.query(
      `UPDATE friend_cards
       SET card_title = ?, card_number = ?, sheba_number = ?, description = ?
       WHERE id = ?`,
      [cardTitle.trim(), cardNumber, formattedSheba, description?.trim() || null, friendCardId]
    );

    return NextResponse.json({
      message: 'کارت دوست با موفقیت بروزرسانی شد',
    });
  } catch (error: any) {
    console.error('Error updating friend card:', error);
    return NextResponse.json(
      { error: error.message || 'خطا در بروزرسانی کارت دوست' },
      { status: error.message.includes('وارد') ? 401 : 500 }
    );
  }
}
