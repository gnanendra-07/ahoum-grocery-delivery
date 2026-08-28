import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Category, Product } from '../types';
import { mockApi } from '../services/mockApi';
import { ProductCard } from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonLoader';
import { ErrorMessage } from '../components/ErrorMessage';
import { Sparkles, ArrowRight, Zap, PackageX } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [catRes, prodRes] = await Promise.all([
        mockApi.getCategories(),
        mockApi.getProducts({ sortBy: 'popular', limit: 10 }),
      ]);

      setCategories(catRes.data);
      setPopularProducts(prodRes.data);
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

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-1.5 text-brand-200 text-xs font-semibold uppercase tracking-wider mb-2">
          <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>Express 10-Min Delivery Promise</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight max-w-lg">
          Fresh Groceries Delivered To Your Doorstep
        </h1>
        <p className="text-xs sm:text-sm text-brand-100 mt-2 max-w-md">
          Farm-fresh fruits, organic vegetables, dairy & daily bakery staples delivered in minutes.
        </p>
        <Link
          to="/category/fresh-fruits"
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-800 text-xs sm:text-sm font-bold rounded-xl shadow hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all"
        >
          <span>Shop Fresh Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Explore Categories</h2>
          <span className="text-xs text-gray-500 font-medium">{categories.length} Categories</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white p-3 rounded-2xl border border-gray-100 h-28 bg-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:border-brand-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-all flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-semibold text-gray-800 line-clamp-1 group-hover:text-brand-600">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Popular Products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Popular Right Now</span>
          </h2>
        </div>

        {loading ? (
          <SkeletonGrid count={5} />
        ) : error ? (
          <ErrorMessage title="Failed to load items" message={error} onRetry={fetchData} />
        ) : popularProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 my-4">
            <PackageX className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-800">No popular products found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
