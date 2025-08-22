'use server';

import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getAuthUser } from './utils';
import { revalidatePath } from 'next/cache';

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;

  // Server-side validation
  if (!email || !name || !password || !confirmPassword || !phone || !address) {
    return { error: '모든 필드를 입력해주세요.' };
  }
  if (password.length < 6) {
    return { error: '비밀번호는 6자 이상이어야 합니다.' };
  }
  if (password !== confirmPassword) {
    return { error: '비밀번호가 일치하지 않습니다.' };
  }
  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return { error: '유효한 이메일 형식이 아닙니다.' };
  }
  if (!/^[가-힣]+$/.test(name)) {
    return { error: '이름은 한글만 입력 가능합니다.' };
  }
  if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phone)) {
    return { error: '유효한 연락처 형식이 아닙니다 (예: 010-1234-5678).' };
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: '이미 존재하는 이메일입니다.' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: hashedPassword,
        phone,
        addresses: {
          create: { addressLine1: address, isDefault: true },
        },
      },
    });

    console.log('User registered:', user.email);
    redirect('/auth/signin'); // Redirect to sign-in page on success

  } catch (e) {
    console.error('Error during signup:', e);
    return { error: '회원가입 중 오류가 발생했습니다.' };
  }
}

export async function signin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: '이메일과 비밀번호를 입력해주세요.' };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    }

    return { success: true, userId: user.id };

  } catch (e) {
    console.error('Error during signin:', e);
    return { error: '로그인 중 오류가 발생했습니다.' };
  }
}

export async function logout() {
  (await cookies()).delete('session');
  redirect('/');
}

export async function updateProfile(formData: FormData) {
  const userId = parseInt(formData.get('userId') as string, 10);
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;

  // Server-side validation
  if (!userId) {
    return { error: '사용자 ID가 없습니다.' };
  }
  if (!name) {
    return { error: '이름을 입력해주세요.' };
  }
  if (!/^[가-힣]+$/.test(name)) {
    return { error: '이름은 한글만 입력 가능합니다.' };
  }
  if (!phone) {
    return { error: '연락처를 입력해주세요.' };
  }
  if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phone)) {
    return { error: '유효한 연락처 형식이 아닙니다 (예: 010-1234-5678).' };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
      },
    });
    console.log('User profile updated:', updatedUser.email);
    revalidatePath('/my-page'); // Revalidate /my-page after profile update
    return { success: true };
  } catch (e) {
    console.error('Error updating profile:', e);
    return { error: '회원 정보 수정 중 오류가 발생했습니다.' };
  }
}

export async function addAddress(formData: FormData) {
  const addressLine1 = formData.get('addressLine1') as string;
  const addressLine2 = formData.get('addressLine2') as string;
  const city = formData.get('city') as string;
  const postalCode = formData.get('postalCode') as string;
  const isDefault = formData.get('isDefault') === 'true';

  const user = await getAuthUser(); // Get user from session

  if (!user) {
    return { error: '로그인이 필요합니다.' };
  }

  // Server-side validation
  if (!addressLine1 || !city || !postalCode) {
    return { error: '필수 주소 정보를 입력해주세요.' };
  }

  try {
    // If new address is default, set all other addresses for this user to non-default
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: user.id,
        addressLine1,
        addressLine2,
        city,
        postalCode,
        isDefault,
      },
    });
    console.log('New address added:', newAddress.id);
    revalidatePath('/my-page'); // Revalidate /my-page after adding address
    return { success: true };
  } catch (e) {
    // console.error('Error adding address:', e);
    return { error: '주소 추가 중 오류가 발생했습니다.' };
  }
}

export async function updateAddress(formData: FormData) {
  const addressId = parseInt(formData.get('addressId') as string, 10);
  const addressLine1 = formData.get('addressLine1') as string;
  const addressLine2 = formData.get('addressLine2') as string;
  const city = formData.get('city') as string;
  const postalCode = formData.get('postalCode') as string;
  const isDefault = formData.get('isDefault') === 'true';

  const user = await getAuthUser();

  if (!user) {
    return { error: '로그인이 필요합니다.' };
  }
  if (!addressId) {
    return { error: '주소 ID가 없습니다.' };
  }
  if (!addressLine1 || !city || !postalCode) {
    return { error: '필수 주소 정보를 입력해주세요.' };
  }

  try {
    // Ensure user owns the address
    const existingAddress = await prisma.address.findUnique({ where: { id: addressId, userId: user.id } });
    if (!existingAddress) {
      return { error: '주소를 찾을 수 없거나 권한이 없습니다.' };
    }

    // If new address is default, set all other addresses for this user to non-default
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        addressLine1,
        addressLine2,
        city,
        postalCode,
        isDefault,
      },
    });
    console.log('Address updated:', updatedAddress.id);
    return { success: true };
  } catch (e) {
    // console.error('Error updating address:', e);
    return { error: '회원 정보 수정 중 오류가 발생했습니다.' };
  }
}

export async function deleteAddress(formData: FormData) {
  const addressId = parseInt(formData.get('addressId') as string, 10);

  const user = await getAuthUser();

  if (!user) {
    return { error: '로그인이 필요합니다.' };
  }
  if (!addressId) {
    return { error: '주소 ID가 없습니다.' };
  }

  try {
    // Ensure user owns the address
    const existingAddress = await prisma.address.findUnique({ where: { id: addressId, userId: user.id } });
    if (!existingAddress) {
      return { error: '주소를 찾을 수 없거나 권한이 없습니다.' };
    }

    // Prevent deletion of default address
    if (existingAddress.isDefault) {
      return { error: '기본 주소는 삭제할 수 없습니다.' };
    }

    await prisma.address.delete({ where: { id: addressId } });
    console.log('Address deleted:', addressId);
    revalidatePath('/my-page'); // Revalidate /my-page to show updated list
    return { success: true };
  } catch (e) {
    // console.error('Error deleting address:', e);
    return { error: '주소 삭제 중 오류가 발생했습니다.' };
  }
}


