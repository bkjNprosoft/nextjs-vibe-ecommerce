'use client';

import { useState, useEffect } from 'react';
import { useToastStore } from '@/store/toastStore';
import { updateProfile } from '@/app/auth/actions'; // Server action for update
import { useRouter } from 'next/navigation';

// This component will be rendered on the client, but needs initial user data.
// We'll pass it as a prop from a Server Component wrapper.
interface EditProfilePageProps {
  user: {
    id: number;
    email: string;
    name: string;
    phone: string | null;
  };
}

export default function EditProfilePage({ user: initialUser }: EditProfilePageProps) {
  const [formData, setFormData] = useState({
    name: initialUser.name,
    phone: initialUser.phone || '',
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
    // Name validation (Korean characters)
    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.';
    } else if (!/^[가-힣]+$/.test(formData.name)) {
      newErrors.name = '이름은 한글만 입력 가능합니다.';
    }

    // Phone validation (000-0000-0000 format)
    if (!formData.phone) {
      newErrors.phone = '연락처를 입력해주세요.';
    } else if (!/^\d{3}-\d{3,4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '유효한 연락처 형식이 아닙니다 (예: 010-1234-5678).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      showToast('회원 정보를 저장 중입니다...', 'info');
      const data = new FormData();
      data.append('userId', initialUser.id.toString());
      data.append('name', formData.name);
      data.append('phone', formData.phone);

      const response = await updateProfile(data);

      if (response?.error) {
        showToast(`오류: ${response.error}`, 'error');
      } else if (response?.success) {
        showToast('회원 정보가 성공적으로 수정되었습니다.', 'success');
        router.push('/my-page'); // Redirect back to my-page
      } else {
        showToast('알 수 없는 오류가 발생했습니다.', 'error');
      }
    } else {
      showToast('입력 정보를 다시 확인해주세요.', 'warning');
      console.log('Validation failed.', errors);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-secondary-100 py-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-primary-900">회원 정보 수정</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary-700">아이디 (이메일)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={initialUser.email}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
            />
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
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            저장
          </button>
        </form>
      </div>
    </div>
  );
}
