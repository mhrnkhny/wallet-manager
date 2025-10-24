import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'لطفا تمام فیلدها را پر کنید' },
        { status: 400 }
      );
    }

    // Check if user exists
    const [existingUsers]: any = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'این ایمیل قبلا ثبت شده است' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result]: any = await db.query(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );

    const userId = result.insertId;

    // Create token
    const token = await createToken({ userId, email });

    const response = NextResponse.json({
      success: true,
      user: { id: userId, email, name }
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'خطا در ثبت‌نام' },
      { status: 500 }
    );
  }
}
