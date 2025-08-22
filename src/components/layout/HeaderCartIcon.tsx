'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

const HeaderCartIcon = () => {
  const { items } = useCartStore();

  // Calculate the total number of items in the cart
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link href="/cart" className="relative text-primary-100 hover:text-white">
      <span>장바구니</span>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
};

export default HeaderCartIcon;
