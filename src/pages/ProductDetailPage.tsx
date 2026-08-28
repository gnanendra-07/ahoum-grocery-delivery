import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { mockApi } from '../services/mockApi';
import { useCartStore } from '../stores/useCartStore';
import { useFavoritesStore } from '../stores/useFavoritesStore';
import { formatCurrency } from '../utils/formatters';
import { SkeletonProductDetail } from '../components/SkeletonLoader';
import { ErrorMessage } from '../components/ErrorMessage';
import { ArrowLeft, Heart, Plus, Minus, Star, Share2, ChevronDown, ChevronRight } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Accordion state
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(true);
  const [isNutritionOpen, setIsNutritionOpen] = useState<boolean>(false);

  const { addItem, updateQuantity, getItemQuantity } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const fetchProduct = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const res = await mockApi.getProductById(id);
      if (res.data) {
        setProduct(res.data);
      } else {
        setError('Product not found.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch product details.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return <SkeletonProductDetail />;
  }

  if (error || !product) {
    return (
      <div className="space-y-4 p-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded"
          type="button"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <ErrorMessage message={error || 'Product not found.'} onRetry={fetchProduct} />
      </div>
    );
  }

  const quantity = getItemQuantity(product.id);
  const favorite = isFavorite(product.id);
  const displayPrice = product.discountPrice ?? product.price;
  const isOutOfStock = product.stock <= 0;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch {
        // Ignored
      }
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* 1. Header: Back & Share */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-700 hover:text-gray-900 transition-colors focus-visible:outline-none"
          aria-label="Go back"
          type="button"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleShare}
          className="p-2 text-gray-700 hover:text-gray-900 transition-colors focus-visible:outline-none"
          aria-label="Share product"
          type="button"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Large Product Image Container (Clean, no overlays/labels) */}
      <div className="bg-gray-50/80 rounded-3xl p-6 flex items-center justify-center relative overflow-hidden h-60 border border-gray-100/60 shadow-inner">
        <img
          src={product.images[0]}
          alt={product.name}
          className={`max-h-full max-w-full object-contain ${isOutOfStock ? 'grayscale-[30%] opacity-75' : ''}`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
          }}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-gray-800/60 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* 3. Product Title, Weight & Favorite Icon */}
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-900 leading-snug">{product.name}</h1>
          <button
            onClick={() => toggleFavorite(product.id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors focus-visible:outline-none flex-shrink-0 mt-0.5"
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            type="button"
          >
            <Heart className={`w-6 h-6 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
        <p className="text-xs font-semibold text-gray-400">{product.unit}</p>
      </div>

      {/* 4. Quantity Controls & Price Row */}
      <div className="flex items-center justify-between pt-1">
        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateQuantity(product.id, Math.max(0, quantity - 1))}
            disabled={quantity === 0 || isOutOfStock}
            className="p-2 text-gray-400 hover:text-[#53B175] disabled:opacity-30 transition-colors focus-visible:outline-none"
            aria-label="Decrease quantity"
            type="button"
          >
            <Minus className="w-5 h-5" />
          </button>

          <div className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-900 shadow-sm bg-white">
            {isOutOfStock ? 0 : (quantity > 0 ? quantity : 1)}
          </div>

          <button
            onClick={() => {
              if (!isOutOfStock) {
                if (quantity === 0) {
                  addItem(product);
                } else {
                  updateQuantity(product.id, quantity + 1);
                }
              }
            }}
            disabled={isOutOfStock}
            className="p-2 text-[#53B175] hover:text-[#489d67] disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-visible:outline-none"
            aria-label="Increase quantity"
            type="button"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Price */}
        <span className="text-2xl font-black text-gray-900">
          {formatCurrency(displayPrice)}
        </span>
      </div>

      <hr className="border-gray-100" />

      {/* 5. Product Detail Collapsible Accordion */}
      <div className="border-b border-gray-100 pb-3">
        <button
          onClick={() => setIsDetailOpen(!isDetailOpen)}
          className="w-full flex items-center justify-between py-1 text-left focus-visible:outline-none"
          type="button"
        >
          <span className="text-sm font-bold text-gray-900">Product Detail</span>
          {isDetailOpen ? (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {isDetailOpen && (
          <p className="text-xs text-gray-500 leading-relaxed mt-2 pr-2">
            {product.description}
          </p>
        )}
      </div>

      {/* 6. Nutritions Row */}
      <div className="border-b border-gray-100 pb-3">
        <button
          onClick={() => setIsNutritionOpen(!isNutritionOpen)}
          className="w-full flex items-center justify-between py-1 text-left focus-visible:outline-none"
          type="button"
        >
          <span className="text-sm font-bold text-gray-900">Nutritions</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
              100g
            </span>
            {isNutritionOpen ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </div>
        </button>

        {isNutritionOpen && product.nutritionalInfo && (
          <div className="grid grid-cols-3 gap-2 mt-2 pt-1 text-center">
            {product.nutritionalInfo.calories && (
              <div className="bg-amber-50 p-2 rounded-xl">
                <span className="block text-xs font-bold text-amber-900">{product.nutritionalInfo.calories} kcal</span>
                <span className="text-[10px] text-amber-700">Calories</span>
              </div>
            )}
            {product.nutritionalInfo.protein && (
              <div className="bg-blue-50 p-2 rounded-xl">
                <span className="block text-xs font-bold text-blue-900">{product.nutritionalInfo.protein}</span>
                <span className="text-[10px] text-blue-700">Protein</span>
              </div>
            )}
            {product.nutritionalInfo.carbs && (
              <div className="bg-emerald-50 p-2 rounded-xl">
                <span className="block text-xs font-bold text-emerald-900">{product.nutritionalInfo.carbs}</span>
                <span className="text-[10px] text-emerald-700">Carbs</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 7. Review Row */}
      <div className="border-b border-gray-100 pb-3">
        <div className="w-full flex items-center justify-between py-1">
          <span className="text-sm font-bold text-gray-900">Review</span>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 ml-1" />
          </div>
        </div>
      </div>

      {/* 8. Add To Basket Green Button (disabled when out of stock) */}
      <div className="pt-2">
        {isOutOfStock ? (
          <button
            disabled
            className="w-full py-4 bg-gray-200 text-gray-400 font-bold text-sm rounded-2xl cursor-not-allowed flex items-center justify-center gap-2"
            type="button"
          >
            Out of Stock
          </button>
        ) : (
          <button
            onClick={() => addItem(product)}
            className="w-full py-4 bg-[#53B175] hover:bg-[#489d67] active:scale-[0.99] text-white font-bold text-sm rounded-2xl shadow-sm transition-all focus-visible:outline-none flex items-center justify-center gap-2"
            type="button"
          >
            Add To Basket
          </button>
        )}
      </div>
    </div>
  );
};
