import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { mockApi } from '../services/mockApi';
import { useFavoritesStore } from '../stores/useFavoritesStore';
import { ProductCard } from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonLoader';
import { ErrorMessage } from '../components/ErrorMessage';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { favoriteIds, clearFavorites } = useFavoritesStore();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    if (favoriteIds.length === 0) {
      setFavoriteProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await mockApi.getProducts({ limit: 100 });
      const filtered = res.data.filter((p) => favoriteIds.includes(p.id));
      setFavoriteProducts(filtered);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch favorite products.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [favoriteIds]);

  if (!loading && favoriteIds.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 my-6 space-y-3 max-w-lg mx-auto">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">No Favorites Saved</h2>
        <p className="text-xs text-gray-500 max-w-xs mx-auto">
          Tap the heart icon on any product to save it to your personal favorites list.
        </p>
        <Link
          to="/"
          className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <span>My Favorites ({favoriteIds.length})</span>
        </h1>

        {favoriteIds.length > 0 && (
          <button
            onClick={clearFavorites}
            className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-2 py-1"
            type="button"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        )}
      </div>

      {loading ? (
        <SkeletonGrid count={5} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchFavorites} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
