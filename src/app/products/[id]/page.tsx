import { prisma } from "@/lib/db";
import AddToCartButton from "@/components/products/AddToCartButton";
import type { Product } from "@prisma/client";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product: Product | null = await prisma.product.findUnique({
    where: { id: parseInt(params.id, 10) },
  });

  if (!product) {
    return <div className="container mx-auto py-8 text-center">상품을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Side: Image */}
        <div className="w-full h-96 bg-gray-200 rounded-lg"></div>

        {/* Right Side: Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="mt-4">
            <span className="text-sm text-gray-500">사이즈</span>
            <div className="flex space-x-2 mt-2">
              {/* Placeholder for size options */}
              <button className="px-4 py-2 border rounded-md hover:border-black">S</button>
              <button className="px-4 py-2 border rounded-md hover:border-black">M</button>
              <button className="px-4 py-2 border rounded-md hover:border-black">L</button>
              <button className="px-4 py-2 border rounded-md hover:border-black">XL</button>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">색상</span>
            <div className="flex space-x-2 mt-2">
              {/* Placeholder for color options */}
              <div className="w-8 h-8 rounded-full bg-black border-2 border-gray-200 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-gray-200 cursor-pointer"></div>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">수량</span>
            <div className="flex items-center mt-2">
              <input type="number" defaultValue={1} min={1} className="w-20 border rounded-md text-center" />
            </div>
          </div>
          <div className="mt-8 text-3xl font-bold text-right">
            {product.price.toLocaleString()}원
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>

      {/* Bottom Section: Description & Reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4 text-primary-900">상품 설명</h2>
        <div className="prose max-w-none">
          <p>{product.description || '상세 설명이 없습니다.'}</p>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-primary-900">리뷰</h2>
        <div className="border rounded-lg p-4">
          <p className="text-primary-500">아직 리뷰가 없습니다.</p>
        </div>
      </div>
    </div>
  );
}
