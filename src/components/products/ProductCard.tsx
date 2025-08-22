import Link from 'next/link';
import type { Product } from '@prisma/client';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/products/${product.id}`} className="block group">
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Placeholder for product image */}
        <div className="w-full h-64 bg-gray-200"></div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-blue-600">{product.name}</h3>
          <p className="text-gray-600 mt-2">{product.price.toLocaleString()}원</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
