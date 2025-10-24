import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import db from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'نام الزامی است' },
        { status: 400 }
      );
    }

    await db.query(
      'UPDATE users SET name = ? WHERE id = ?',
      [name.trim(), session.userId]
    );

    return NextResponse.json({
      message: 'پروفایل با موفقیت به‌روزرسانی شد',
      name: name.trim()
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: error.message || 'خطا در به‌روزرسانی پروفایل' },
      { status: error.message === 'لطفا وارد شوید' ? 401 : 500 }
    );
  }
}
