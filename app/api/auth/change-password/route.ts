import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'رمز عبور فعلی و جدید الزامی است' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'رمز عبور جدید باید حداقل 6 کاراکتر باشد' },
        { status: 400 }
      );
    }

    // Get user's current password
    const [users]: any = await db.query(
      'SELECT password FROM users WHERE id = ?',
      [session.userId]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, users[0].password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'رمز عبور فعلی اشتباه است' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, session.userId]
    );

    return NextResponse.json({
      message: 'رمز عبور با موفقیت تغییر کرد'
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: error.message || 'خطا در تغییر رمز عبور' },
      { status: error.message === 'لطفا وارد شوید' ? 401 : 500 }
    );
  }
}
