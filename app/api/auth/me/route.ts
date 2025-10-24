import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();

    const [users]: any = await db.query(
      'SELECT id, email, name, created_at FROM users WHERE id = ?',
      [session.userId]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: users[0] });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: error.message || 'خطا در دریافت اطلاعات کاربر' },
      { status: error.message === 'لطفا وارد شوید' ? 401 : 500 }
    );
  }
}
