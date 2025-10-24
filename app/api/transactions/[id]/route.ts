import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    await db.query(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [id, session.userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete transaction error:', error);
    return NextResponse.json(
      { error: 'خطا در حذف تراکنش' },
      { status: 500 }
    );
  }
}
