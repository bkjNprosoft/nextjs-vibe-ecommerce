import { getAuthUser } from '@/app/auth/utils';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DeleteAddressButton from '@/components/my-page/DeleteAddressButton'; // Import DeleteAddressButton
import SetDefaultAddressButton from '@/components/my-page/SetDefaultAddressButton'; // Import SetDefaultAddressButton
import type { User, Order, Address } from '@prisma/client';
import { prisma } from '@/lib/db';

export default async function MyPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/auth/signin');
  }

  // Fetch user's orders with order items
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true, // Include product details for each order item
        },
      },
      address: true, // Include address details for each order
    },
    orderBy: { createdAt: 'desc' },
  });

  // Fetch user's addresses
  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: { isDefault: 'desc' },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary-900">마이 페이지</h1>

      {/* User Info Section */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary-700">회원 정보</h2>
        <p className="text-primary-700"><strong>이메일:</strong> {user.email}</p>
        <p className="text-primary-700"><strong>이름:</strong> {user.name}</p>
        <p className="text-primary-700"><strong>연락처:</strong> {user.phone || '미등록'}</p>
        <div className="mt-4">
          <Link href="/my-page/edit-profile" className="text-primary-600 hover:text-primary-800 font-medium">회원 정보 수정</Link>
        </div>
      </section>

      {/* Order History Section */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary-700">주문 내역</h2>
        {orders.length === 0 ? (
          <p className="text-primary-500">주문 내역이 없습니다.</p>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="border border-primary-200 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-primary-800">주문 번호: {order.id}</span>
                  <span className="text-sm text-primary-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-primary-700">총 금액: {order.totalAmount.toLocaleString()}원</p>
                <p className="text-primary-700">상태: {order.status}</p>
                <p className="text-primary-700">배송지: {order.address.addressLine1}</p>
                <ul className="list-disc list-inside mt-2 text-primary-700">
                  {order.items.map(item => (
                    <li key={item.id}>{item.product.name} ({item.quantity}개) - {item.pricePerItem.toLocaleString()}원</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Address Management Section */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-primary-700">주소 관리</h2>
        {addresses.length === 0 ? (
          <p className="text-primary-500">등록된 주소가 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {addresses.map(address => (
              <div key={address.id} className="border border-primary-200 p-4 rounded-md">
                <p className="text-primary-700">{address.addressLine1} {address.addressLine2}</p>
                <p className="text-primary-700">{address.city}, {address.postalCode}</p>
                {address.isDefault && <span className="text-sm text-primary-600">(기본 주소)</span>}
                <div className="mt-2">
                  <Link href={`/my-page/addresses/edit/${address.id}`} className="text-primary-600 hover:text-primary-800 font-medium mr-4">수정</Link>
                  <DeleteAddressButton addressId={address.id} isDefault={address.isDefault} />
                  <SetDefaultAddressButton addressId={address.id} isDefault={address.isDefault} />
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <Link href="/my-page/addresses/add" className="text-primary-600 hover:text-primary-800 font-medium">새 주소 추가</Link>
        </div>
      </section>
    </div>
  );
}

