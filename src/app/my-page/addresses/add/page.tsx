'use client';

import { useState } from 'react';
import { useToastStore } from '@/store/toastStore';
import { addAddress } from '@/app/auth/actions';
import { useRouter } from 'next/navigation';
import { useLoadingStore } from '@/store/loadingStore';

export default function AddAddressPage() {
  const [formData, setFormData] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { showToast } = useToastStore();
  const router = useRouter();
  const { startLoading, stopLoading } = useLoadingStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.addressLine1) newErrors.addressLine1 = '주소를 입력해주세요.';
    if (!formData.city) newErrors.city = '도시를 입력해주세요.';
    if (!formData.postalCode) newErrors.postalCode = '우편번호를 입력해주세요.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        startLoading();
        const data = new FormData();
        data.append('addressLine1', formData.addressLine1);
        data.append('addressLine2', formData.addressLine2);
        data.append('city', formData.city);
        data.append('postalCode', formData.postalCode);
        data.append('isDefault', formData.isDefault ? 'true' : 'false');

        const response = await addAddress(data);

        if (response?.error) {
          showToast(`오류: ${response.error}`, 'error');
        } else if (response?.success) {
          showToast('주소가 성공적으로 추가되었습니다.', 'success');
          await router.push('/my-page'); // Await router.push()
        } else {
          showToast('알 수 없는 오류가 발생했습니다.', 'error');
        }
      } finally {
        stopLoading();
      }
    } else {
      showToast('입력 정보를 다시 확인해주세요.', 'warning');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-secondary-100 py-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-primary-900">새 주소 추가</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="addressLine1" className="block text-sm font-medium text-primary-700">주소</label>
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.addressLine1 && <p className="mt-1 text-sm text-red-600">{errors.addressLine1}</p>}
          </div>
          <div>
            <label htmlFor="addressLine2" className="block text-sm font-medium text-primary-700">상세 주소 (선택 사항)</label>
            <input
              type="text"
              id="addressLine2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-primary-700">도시</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-primary-700">우편번호</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isDefault" className="ml-2 block text-sm text-primary-700">기본 배송지로 설정</label>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            주소 저장
          </button>
        </form>
      </div>
    </div>
  );
}
