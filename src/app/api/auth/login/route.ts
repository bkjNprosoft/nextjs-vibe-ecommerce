import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Should be the same as in actions.ts

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: '이메일과 비밀번호를 입력해주세요.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1w' });

    // Set JWT as session cookie
    cookies().set('session', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return NextResponse.json({ success: true, message: '로그인 성공!' });

  } catch (e) {
    console.error('Error in API login route:', e);
    return NextResponse.json({ error: '로그인 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
