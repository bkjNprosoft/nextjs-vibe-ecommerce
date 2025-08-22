'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { getAuthUserAddresses, placeOrder } from '@/app/auth/actions';
import type { Address } from '@prisma/client';
import { useLoadingStore } from '@/store/loadingStore'; // Import useLoadingStore

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCartStore();
  const { showToast } = useToastStore();
  const router = useRouter();
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [newAddressData, setNewAddressData] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
  });
  const [isNewAddress, setIsNewAddress] = useState(false);
  const { startLoading, stopLoading } = useLoadingStore(); // Get loading actions

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Fetch user addresses when component mounts
  const fetchAddresses = async () => {
    try { // Add try...finally block
      startLoading(); // Start loading
      const response = await getAuthUserAddresses();
      if (response?.addresses) {
        setUserAddresses(response.addresses);
        const defaultAddress = response.addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        }
      }
    } finally {
      stopLoading(); // Stop loading
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'new') {
      setIsNewAddress(true);
      setSelectedAddressId(null);
    } else {
      setIsNewAddress(false);
      setSelectedAddressId(parseInt(value, 10));
    }
  };

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddressData({ ...newAddressData, [name]: value });
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      showToast('장바구니가 비어 있습니다.', 'warning');
      return;
    }

    let addressToUse: Address | null = null;
    if (isNewAddress) {
      if (!newAddressData.addressLine1 || !newAddressData.city || !newAddressData.postalCode) {
        showToast('새 주소의 필수 정보를 모두 입력해주세요.', 'warning');
        return;
      }
      addressToUse = { ...newAddressData, id: 0, userId: 0, isDefault: false }; // Dummy ID/userId for new address
    } else if (selectedAddressId) {
      addressToUse = userAddresses.find(addr => addr.id === selectedAddressId) || null;
    }

    if (!addressToUse) {
      showToast('주소를 선택하거나 새 주소를 입력해주세요.', 'warning');
      return;
    }

    try { // Add try...finally block
      startLoading(); // Start loading
      const orderResponse = await placeOrder({
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice,
        addressId: isNewAddress ? null : addressToUse.id,
        newAddress: isNewAddress ? newAddressData : null,
      });

      if (orderResponse?.success) {
        showToast('주문이 성공적으로 완료되었습니다!', 'success');
        clearCart();
        await router.push('/my-page/orders'); // Await router.push()
      } else {
        showToast(`주문 실패: ${orderResponse?.error || '알 수 없는 오류'}`, 'error');
      }
    } finally {
      stopLoading(); // Stop loading
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">결제</h1>

      {/* Cart Summary */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-3">주문 요약</h2>
        {cartItems.length === 0 ? (
          <p>장바구니가 비어 있습니다.</p>
        ) : (
          <>
            <ul>
              {cartItems.map(item => (
                <li key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{item.price * item.quantity}원</span>
                </li>
              ))}
            </ul>
            <div className="text-right font-bold text-lg mt-3">총액: {totalPrice}원</div>
          </>
        )}
      </div>

      {/* Address Selection */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-3">배송 주소</h2>
        <div className="mb-4">
          <label htmlFor="addressSelect" className="block text-sm font-medium text-primary-700 mb-2">기존 주소 선택</label>
          <select
            id="addressSelect"
            onChange={handleAddressChange}
            value={selectedAddressId || 'new'}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="new">새 주소 입력</option>
            {userAddresses.map(addr => (
              <option key={addr.id} value={addr.id}>
                {addr.addressLine1} {addr.addressLine2} ({addr.postalCode})
              </option>
            ))}
          </select>
        </div>

        {isNewAddress && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium mb-2">새 주소 입력</h3>
            <div>
              <label htmlFor="newAddressLine1" className="block text-sm font-medium text-primary-700">주소</label>
              <input type="text" id="newAddressLine1" name="addressLine1" value={newAddressData.addressLine1} onChange={handleNewAddressChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="newAddressLine2" className="block text-sm font-medium text-primary-700">상세 주소 (선택 사항)</label>
              <input type="text" id="newAddressLine2" name="addressLine2" value={newAddressData.addressLine2} onChange={handleNewAddressChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="newCity" className="block text-sm font-medium text-primary-700">도시</label>
              <input type="text" id="newCity" name="city" value={newAddressData.city} onChange={handleNewAddressChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="newPostalCode" className="block text-sm font-medium text-primary-700">우편번호</label>
              <input type="text" id="newPostalCode" name="postalCode" value={newAddressData.postalCode} onChange={handleNewAddressChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>
        )}
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        className="w-full bg-primary-700 text-white py-3 rounded-lg font-semibold text-lg hover:bg-primary-800 transition duration-200"
      >
        주문하기
      </button>
    </div>
  );
}
