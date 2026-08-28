import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { mockApi } from '../services/mockApi';
import { useCartStore } from '../stores/useCartStore';
import { useFavoritesStore } from '../stores/useFavoritesStore';
import { formatCurrency, calculateDiscountPercentage } from '../utils/formatters';
import { SkeletonProductDetail } from '../components/SkeletonLoader';
import { ErrorMessage } from '../components/ErrorMessage';
import { ArrowLeft, Heart, Plus, Minus, Star, ShieldCheck, Truck, Flame } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        setSelectedImage(res.data.images[0] || '');
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
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
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
  const discountPercent = product.discountPrice
    ? calculateDiscountPercentage(product.price, product.discountPrice)
    : 0;

  const isOutOfStock = product.stock <= 0;
  const isMaxStockReached = quantity >= product.stock;

  return (
    <div className="space-y-6 pb-6">
      {/* Top Nav: Back & Favorite */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 bg-white rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label="Go back"
          type="button"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => toggleFavorite(product.id)}
          className="p-2.5 bg-white rounded-full border border-gray-200 text-gray-400 hover:text-red-500 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          type="button"
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Mobile Frame Container */}
      <div className="space-y-5">
        {/* Left Column: Gallery */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-3">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center relative">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow">
                {discountPercent}% OFF
              </span>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
                <span className="text-white text-xs font-bold uppercase tracking-wider bg-red-600 px-3 py-1 rounded-lg">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail carousel */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pt-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  aria-label={`Select product image view ${idx + 1}`}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                    selectedImage === img ? 'border-brand-600 scale-105' : 'border-gray-200 opacity-70'
                  }`}
                  type="button"
                >
                  <img src={img} alt={`${product.name} preview ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Information & Controls */}
        <div className="space-y-5">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
                {product.categoryName}
              </span>
              {product.isOrganic && (
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Organic Certified
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug">{product.name}</h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">{product.unit}</p>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-800">{product.rating}</span>
              </div>
              <span className="text-xs text-gray-400">({product.reviewCount} verified reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 pt-2 border-t border-gray-100">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl font-black text-gray-900">
                    {formatCurrency(product.discountPrice)}
                  </span>
                  <span className="text-base text-gray-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-black text-gray-900">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3 shadow-sm">
              <Truck className="w-5 h-5 text-brand-600 flex-shrink-0" />
              <span className="text-gray-700 font-medium">10 Min Express Delivery</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-brand-600 flex-shrink-0" />
              <span className="text-gray-700 font-medium">Quality Guaranteed</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Description</h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Nutritional Info */}
          {product.nutritionalInfo && (
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                Nutritional Values (Per Serving)
              </h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                {product.nutritionalInfo.calories && (
                  <div className="bg-amber-50 p-2.5 rounded-2xl">
                    <span className="block text-sm font-bold text-amber-900">
                      {product.nutritionalInfo.calories}
                    </span>
                    <span className="text-[10px] text-amber-700 font-medium">kcal</span>
                  </div>
                )}
                {product.nutritionalInfo.protein && (
                  <div className="bg-blue-50 p-2.5 rounded-2xl">
                    <span className="block text-sm font-bold text-blue-900">
                      {product.nutritionalInfo.protein}
                    </span>
                    <span className="text-[10px] text-blue-700 font-medium">Protein</span>
                  </div>
                )}
                {product.nutritionalInfo.carbs && (
                  <div className="bg-emerald-50 p-2.5 rounded-2xl">
                    <span className="block text-sm font-bold text-emerald-900">
                      {product.nutritionalInfo.carbs}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">Carbs</span>
                  </div>
                )}
                {product.nutritionalInfo.fat && (
                  <div className="bg-purple-50 p-2.5 rounded-2xl">
                    <span className="block text-sm font-bold text-purple-900">
                      {product.nutritionalInfo.fat}
                    </span>
                    <span className="text-[10px] text-purple-700 font-medium">Fat</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Controller */}
          <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-lg flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-gray-400 font-medium uppercase block">Total Price</span>
              <span className="text-xl font-black text-gray-900">
                {formatCurrency((product.discountPrice ?? product.price) * (quantity || 1))}
              </span>
            </div>

            {isOutOfStock ? (
              <span className="px-5 py-3 bg-gray-100 text-gray-400 font-bold text-xs rounded-2xl uppercase tracking-wider">
                Sold Out
              </span>
            ) : quantity > 0 ? (
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-3 bg-brand-50 border border-brand-200 rounded-2xl px-4 py-2">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="p-1 text-brand-700 hover:bg-brand-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    type="button"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-base font-extrabold text-brand-900 min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    disabled={isMaxStockReached}
                    className="p-1 text-brand-700 hover:bg-brand-100 disabled:opacity-40 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    type="button"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {isMaxStockReached && (
                  <span className="text-[10px] font-semibold text-amber-700">Max stock limit reached</span>
                )}
              </div>
            ) : (
              <button
                onClick={() => addItem(product)}
                className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                type="button"
              >
                <Plus className="w-4 h-4" /> Add To Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
