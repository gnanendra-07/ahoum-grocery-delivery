import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Category, Product } from '../types';
import { mockApi } from '../services/mockApi';
import { ProductCard } from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonLoader';
import { ErrorMessage } from '../components/ErrorMessage';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [catRes, prodRes] = await Promise.all([
        mockApi.getCategories(),
        mockApi.getProducts({ limit: 20 }),
      ]);

      setCategories(catRes.data);
      setProducts(prodRes.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while fetching home data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter products for Figma sections
  const exclusiveOffers = products.filter((p) => p.discountPrice !== undefined && p.discountPrice < p.price).slice(0, 2);
  const bestSelling = products.filter((p) => p.isPopular).slice(0, 2);
  const groceriesProducts = products.slice(2, 4);

  return (
    <div className="space-y-5 pb-4">
      {/* 1. Hero Banner Image */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm h-32 flex items-center p-5 bg-emerald-50">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
          alt="Fresh Vegetables Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-transparent" />
        <div className="relative z-10 text-white max-w-[210px]">
          <h2 className="text-lg font-bold leading-tight drop-shadow-sm">Fresh Vegetables</h2>
          <p className="text-[11px] text-emerald-200 font-medium mt-0.5">Get Up To 40% OFF</p>
        </div>
      </div>

      {/* 2. Exclusive Offer Section */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-base font-bold text-gray-900">Exclusive Offer</h2>
          <Link to="/category/fresh-fruits" className="text-xs font-semibold text-[#53B175] hover:underline">
            See all
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={2} />
        ) : error ? (
          <ErrorMessage title="Failed to load items" message={error} onRetry={fetchData} />
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {exclusiveOffers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Best Selling Section */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-base font-bold text-gray-900">Best Selling</h2>
          <Link to="/category/fresh-fruits" className="text-xs font-semibold text-[#53B175] hover:underline">
            See all
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={2} />
        ) : error ? (
          <ErrorMessage title="Failed to load items" message={error} onRetry={fetchData} />
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {bestSelling.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Groceries Section */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-base font-bold text-gray-900">Groceries</h2>
          <Link to="/category/fresh-fruits" className="text-xs font-semibold text-[#53B175] hover:underline">
            See all
          </Link>
        </div>

        {/* Category Cards/Chips Horizontal Carousel */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none mb-3">
          {categories.slice(0, 4).map((cat, idx) => {
            const bgStyles = [
              'bg-orange-50/80 border-orange-100/80 text-orange-900',
              'bg-emerald-50/80 border-emerald-100/80 text-emerald-900',
              'bg-blue-50/80 border-blue-100/80 text-blue-900',
              'bg-amber-50/80 border-amber-100/80 text-amber-900',
            ];
            const styleClass = bgStyles[idx % bgStyles.length];
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border ${styleClass} min-w-[140px] flex-shrink-0 hover:shadow-sm transition-all`}
              >
                <img src={cat.image} alt={cat.name} className="w-8 h-8 object-cover rounded-xl flex-shrink-0" />
                <span className="text-xs font-bold line-clamp-1">{cat.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Groceries Products (2 Columns) */}
        {loading ? (
          <SkeletonGrid count={2} />
        ) : error ? (
          <ErrorMessage title="Failed to load items" message={error} onRetry={fetchData} />
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {groceriesProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
