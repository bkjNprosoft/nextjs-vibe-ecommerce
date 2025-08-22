'use client';

import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import type { Product } from "@prisma/client";

interface AddToCartButtonProps {
  product: Product;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const { showToast } = useToastStore();

  const handleAddToCart = () => {
    addItem(product);
    showToast(`${product.name}이(가) 장바구니에 담겼습니다.`, 'info');
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="mt-4 w-full bg-primary-700 text-white py-3 rounded-md hover:bg-primary-800 transition-colors disabled:bg-primary-300"
    >
      장바구니 담기
    </button>
  );
};

export default AddToCartButton;
