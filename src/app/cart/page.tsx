'use client';

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateItemQuantity } = useCartStore();

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary-900">장바구니</h1>
      {items.length === 0 ? (
        <div className="text-center text-primary-500">
          <p>장바구니가 비어있습니다.</p>
          <Link href="/" className="mt-4 inline-block bg-primary-700 text-white px-6 py-2 rounded-md hover:bg-primary-800">
            계속 쇼핑하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between border p-4 rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
                    <div>
                      <h2 className="font-semibold text-primary-900">{item.name}</h2>
                      <p className="text-primary-700">{item.price.toLocaleString()}원</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <input 
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value, 10))}
                      min={1}
                      className="w-16 border rounded-md text-center"
                    />
                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="border p-6 rounded-md bg-primary-100">
              <h2 className="text-xl font-semibold mb-4 text-primary-900">주문 요약</h2>
              <div className="flex justify-between mb-2 text-primary-700">
                <span>상품 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between mb-4 text-primary-700">
                <span>배송비</span>
                <span>무료</span>
              </div>
              <hr className="my-4 border-primary-300"/>
              <div className="flex justify-between font-bold text-lg text-primary-900">
                <span>총 주문 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              <button className="mt-6 w-full bg-primary-700 text-white py-3 rounded-md hover:bg-primary-800">
                결제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
