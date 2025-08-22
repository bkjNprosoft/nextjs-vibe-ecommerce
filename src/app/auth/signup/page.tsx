'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useToastStore } from '@/store/toastStore';
import { signup } from '../actions'; // Import the server action

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { showToast } = useToastStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    // Email validation
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = '유효한 이메일 형식이 아닙니다.';
    }

    // Name validation (Korean characters)
    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.';
    } else if (!/^[가-힣]+$/.test(formData.name)) {
      newErrors.name = '이름은 한글만 입력 가능합니다.';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // Phone validation (000-0000-0000 format)
    if (!formData.phone) {
      newErrors.phone = '연락처를 입력해주세요.';
    } else if (!/^\d{3}-\d{3,4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '유효한 연락처 형식이 아닙니다 (예: 010-1234-5678).';
    }

    // Address validation
    if (!formData.address) {
      newErrors.address = '배송지 주소를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      showToast('회원가입 정보를 확인 중입니다...', 'info');
      const data = new FormData(e.currentTarget as HTMLFormElement);
      const response = await signup(data);

      if (response?.error) {
        showToast(`오류: ${response.error}`, 'error');
      } else {
        // Redirect is handled by server action, so just show success toast if needed
        // showToast('회원가입 성공!', 'success'); // This toast might not show due to redirect
      }
    } else {
      showToast('입력 정보를 다시 확인해주세요.', 'warning');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-secondary-100 py-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-primary-900">회원가입</h2>
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
            <label htmlFor="name" className="block text-sm font-medium text-primary-700">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary-700">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-primary-700">연락처</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-1234-5678"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-primary-700">배송지 주소</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            회원가입
          </button>
        </form>
        <p className="text-center text-sm text-primary-700">
          이미 계정이 있으신가요? <Link href="/auth/signin" className="font-medium text-primary-600 hover:text-primary-800">로그인</Link>
        </p>
      </div>
    </div>
  );
}
