import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/db';
import type { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Should be the same as in actions.ts

export async function getAuthUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    return user;
  } catch (error) {
    console.error('Error verifying JWT or fetching user:', error);
    // If token is invalid, clear it
    cookieStore.delete('session');
    return null;
  }
}
