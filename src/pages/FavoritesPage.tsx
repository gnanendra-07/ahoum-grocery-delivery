import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Product } from '../types';
import { mockApi } from '../services/mockApi';
import { useFavoritesStore } from '../stores/useFavoritesStore';
import { useCartStore } from '../stores/useCartStore';
import { formatCurrency } from '../utils/formatters';
import { ChevronRight, Heart, Wifi, Signal, Battery, ArrowRight } from 'lucide-react';
import { SkeletonGrid } from '../components/SkeletonLoader';
import { ErrorMessage } from '../components/ErrorMessage';

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favoriteIds, toggleFavorite } = useFavoritesStore();
  const { addItem } = useCartStore();

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
      // Map catalog products by favoriteIds to preserve exact favorite order
      const prodMap = new Map<string, Product>(res.data.map((p) => [p.id, p]));
      const favorited = favoriteIds
        .map((id) => prodMap.get(id))
        .filter((p): p is Product => p !== undefined);
      setFavoriteProducts(favorited);
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

  const handleAddAllToCart = () => {
    favoriteProducts.forEach((product) => {
      addItem(product, 1);
    });
    navigate('/cart');
  };

  return (
    <div className="space-y-3 pb-20">
      {/* 1. Status Bar / Top Safe Area */}
      <div className="flex items-center justify-between text-xs font-semibold text-gray-900 pt-1 px-1">
        <span>9:41</span>
        <div className="flex items-center gap-1.5 text-gray-800">
          <Signal className="w-3.5 h-3.5 fill-gray-800" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4 fill-gray-800" />
        </div>
      </div>

      {/* 2. Header: Favorites */}
      <div className="pt-0.5 pb-2 border-b border-gray-100">
        <h1 className="text-base font-bold text-gray-900 text-center">
          Favorites
        </h1>
      </div>

      {/* 3. Dynamic Product List or Empty State */}
      {loading ? (
        <SkeletonGrid count={5} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchFavorites} />
      ) : favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 my-6 space-y-3 max-w-sm mx-auto shadow-sm">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7 fill-red-100 text-red-500" />
          </div>
          <h2 className="text-base font-bold text-gray-900">No Favorites Saved</h2>
          <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
            Tap the heart icon on any product to save it to your personal favorites list.
          </p>
          <Link
            to="/explore"
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#53B175] hover:bg-[#489d67] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-100 pt-1">
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                className="py-3 px-1 flex items-center justify-between gap-3 bg-white hover:bg-gray-50/60 transition-colors group"
              >
                {/* Product Image */}
                <div
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="w-14 h-14 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50/50 flex-shrink-0 cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain p-1 group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Title & Subtitle */}
                <div
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <h3 className="font-bold text-xs text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {product.unit}
                  </p>
                </div>

                {/* Price, Heart Toggle & Chevron */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-bold text-xs text-gray-900">
                    {formatCurrency(product.discountPrice ?? product.price)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className="p-1 text-red-500 hover:text-red-600 transition-colors focus-visible:outline-none"
                    aria-label={`Remove ${product.name} from favorites`}
                    type="button"
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </button>
                  <ChevronRight
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="w-4 h-4 text-gray-400 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 4. Green Add All to Cart Button */}
          <div className="pt-4">
            <button
              onClick={handleAddAllToCart}
              className="w-full bg-[#53B175] hover:bg-[#489d67] text-white text-sm font-bold py-3.5 px-4 rounded-2xl shadow-md transition-all focus-visible:outline-none active:scale-[0.99]"
              type="button"
            >
              Add All to Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};
