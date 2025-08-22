import { prisma } from "@/lib/db";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from '@prisma/client';
import HeroSlider from "@/components/home/HeroSlider";

export default async function Home() {
  // Fetch products from the database using Prisma
  const newProducts: Product[] = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 8,
  });

  const recommendedProducts: Product[] = await prisma.product.findMany({
    orderBy: {
      id: 'asc', // Or any other criteria for recommended products
    },
    skip: 5, // Skip first 5 to get a different set from newProducts
    take: 10,
  });

  // DEBUG: Log fetched products to the server console
  // console.log('Fetched Products:', newProducts);

  return (
    <main className="bg-secondary-100">
      <div className="w-full overflow-hidden">
        <HeroSlider />
      </div>

      {/* New Arrivals Section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">신상품</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {newProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div >
      </section>

      {/* Recommended Section */}
      <section className="w-full py-16 bg-primary-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">추천 상품</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {recommendedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
