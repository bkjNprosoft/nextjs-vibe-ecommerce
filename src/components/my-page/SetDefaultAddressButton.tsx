'use client';

import { useToastStore } from '@/store/toastStore';
import { updateAddress } from '@/app/auth/actions';
import { useRouter } from 'next/navigation';
import { useLoadingStore } from '@/store/loadingStore'; // Import useLoadingStore

interface SetDefaultAddressButtonProps {
  addressId: number;
  isDefault: boolean;
}

const SetDefaultAddressButton: React.FC<SetDefaultAddressButtonProps> = ({ addressId, isDefault }) => {
  const { showToast } = useToastStore();
  const router = useRouter();
  const { startLoading, stopLoading } = useLoadingStore(); // Get loading actions

  const handleSetDefault = async () => {
    if (isDefault) {
      // Already default, no action needed
      return;
    }

    // showToast('기본 주소로 설정 중입니다...', 'info'); // Removed, loading spinner will handle this
    try { // Add try...finally block
      startLoading(); // Start loading
      const formData = new FormData();
      formData.append('addressId', addressId.toString());
      formData.append('isDefault', 'true'); // Set this address as default
      // Other fields are not needed for this specific update, but updateAddress expects them.
      // We'll pass dummy values or ensure updateAddress handles partial updates.
      formData.append('addressLine1', 'dummy'); // Required by updateAddress server action
      formData.append('city', 'dummy');
      formData.append('postalCode', 'dummy');

      const response = await updateAddress(formData);

      if (response?.error) {
        showToast(`오류: ${response.error}`, 'error');
      } else if (response?.success) {
        showToast('기본 주소로 설정되었습니다.', 'success');
        await router.refresh(); // Await router.refresh()
      } else {
        showToast('알 수 없는 오류가 발생했습니다.', 'error');
      }
    } finally {
      stopLoading(); // Stop loading
    }
  };

  if (isDefault) {
    return null; // Don't show button if already default
  }

  return (
    <button 
      onClick={handleSetDefault}
      className="text-primary-600 hover:text-primary-800 font-medium ml-4"
    >
      기본 주소로 설정
    </button>
  );
};

export default SetDefaultAddressButton;
