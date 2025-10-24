import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// DELETE installment by ID
export async function DELETE(
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

    // Check if installment exists and belongs to user
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

    // Delete installment
    await db.query('DELETE FROM installments WHERE id = ?', [installmentId]);

    return NextResponse.json({
      message: 'قسط با موفقیت حذف شد',
    });
  } catch (error: any) {
    console.error('Error deleting installment:', error);
    return NextResponse.json(
      { error: error.message || 'خطا در حذف قسط' },
      { status: error.message.includes('وارد') ? 401 : 500 }
    );
  }
}

// PUT update installment
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const installmentId = parseInt(id);
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

    if (isNaN(installmentId)) {
      return NextResponse.json(
        { error: 'شناسه قسط نامعتبر است' },
        { status: 400 }
      );
    }

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

    // Check if installment exists and belongs to user
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

    // Update installment
    await db.query(
      `UPDATE installments
       SET installment_title = ?, start_date = ?, end_date = ?, payment_day_of_month = ?,
           total_amount = ?, installment_amount = ?, description = ?
       WHERE id = ?`,
      [
        installmentTitle.trim(),
        startDate,
        endDate,
        paymentDayOfMonth,
        totalAmount,
        installmentAmount,
        description?.trim() || null,
        installmentId,
      ]
    );

    return NextResponse.json({
      message: 'قسط با موفقیت بروزرسانی شد',
    });
  } catch (error: any) {
    console.error('Error updating installment:', error);
    return NextResponse.json(
      { error: error.message || 'خطا در بروزرسانی قسط' },
      { status: error.message.includes('وارد') ? 401 : 500 }
    );
  }
}
