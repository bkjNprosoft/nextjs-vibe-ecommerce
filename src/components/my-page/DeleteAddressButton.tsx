'use client';

import { useToastStore } from '@/store/toastStore';
import { useRouter } from 'next/navigation';
import { deleteAddress } from '@/app/auth/actions';
import { useLoadingStore } from '@/store/loadingStore'; // Import useLoadingStore

interface DeleteAddressButtonProps {
  addressId: number;
  isDefault: boolean;
}

const DeleteAddressButton: React.FC<DeleteAddressButtonProps> = ({ addressId, isDefault }) => {
  const { showToast } = useToastStore();
  const router = useRouter();
  const { startLoading, stopLoading } = useLoadingStore(); // Get loading actions

  const handleDelete = async () => {
    if (window.confirm('정말로 이 주소를 삭제하시겠습니까?')) {
      try { // Add try...finally block
        startLoading(); // Start loading
        const formData = new FormData();
        formData.append('addressId', addressId.toString());

        const response = await deleteAddress(formData);

        if (response?.error) {
          showToast(`오류: ${response.error}`, 'error');
        } else {
          showToast('주소가 삭제되었습니다.', 'success');
          await router.refresh(); // Await router.refresh()
        }
      } finally {
        stopLoading(); // Stop loading
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDefault} // Disable if it's the default address
      className={`px-3 py-1 rounded-md text-sm font-medium ${isDefault
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-red-500 text-white hover:bg-red-600'
      }`}
    >
      삭제
    </button>
  );
};

export default DeleteAddressButton;
