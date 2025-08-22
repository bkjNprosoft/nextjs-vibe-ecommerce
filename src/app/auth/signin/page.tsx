'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToastStore } from '@/store/toastStore';
import { signin } from '../actions';
import { fetchWithLoading } from '@/lib/api';

// API 응답 타입을 정의합니다.
interface ApiResponse {
  success: boolean;
  error?: string;
}

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { showToast } = useToastStore();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = '유효한 이메일 형식이 아닙니다.';
    }
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const data = new FormData(e.currentTarget as HTMLFormElement);
      const authResponse = await signin(data);

      if (authResponse?.error) {
        showToast(`오류: ${authResponse.error}`, 'error');
      } else if (authResponse?.success) {
        try {
          // Add startLoading() here
          startLoading(); // Added
          const apiData = await fetchWithLoading<ApiResponse>('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: formData.email, password: formData.password }),
          });

          if (apiData.success) {
            showToast('로그인 성공!', 'success');
            await router.push('/'); // Await router.push()
          } else {
            showToast(`오류: ${apiData.error || '쿠키 설정 실패'}`, 'error');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
          showToast(`오류: ${errorMessage}`, 'error');
        } finally { // Add finally block here
          stopLoading(); // Added
        }
      } else {
        showToast('알 수 없는 로그인 오류가 발생했습니다.', 'error');
      }
    } else {
      showToast('입력 정보를 다시 확인해주세요.', 'warning');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-secondary-100 py-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-primary-900">로그인</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary-700">아이디 (이메일)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-primary-700">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            로그인
          </button>
        </form>
        <p className="text-center text-sm text-primary-700">
          계정이 없으신가요? <Link href="/auth/signup" className="font-medium text-primary-600 hover:text-primary-800">회원가입</Link>
        </p>
        <p className="text-center text-sm">
          <Link href="#" className="font-medium text-primary-600 hover:text-primary-800">비밀번호 찾기</Link>
        </p>
      </div>
    </div>
  );
}
