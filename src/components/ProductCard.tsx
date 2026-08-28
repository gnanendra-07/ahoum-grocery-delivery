import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Minus, Star } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../stores/useCartStore';
import { useFavoritesStore } from '../stores/useFavoritesStore';
import { formatCurrency, calculateDiscountPercentage } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, updateQuantity, getItemQuantity } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const quantity = getItemQuantity(product.id);
  const favorite = isFavorite(product.id);
  const discountPercent = product.discountPrice
    ? calculateDiscountPercentage(product.price, product.discountPrice)
    : 0;

  const isOutOfStock = product.stock <= 0;
  const isMaxStockReached = quantity >= product.stock;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group relative">
      {/* Top Bar: Badges & Favorite */}
      <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between">
        <div className="flex flex-col gap-1 items-start">
          {discountPercent > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.isOrganic && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
              Organic
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label={favorite ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
          type="button"
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Image & Product Link */}
      <Link
        to={`/product/${product.id}`}
        className="block p-3 pt-8 flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl"
      >
        <div className="aspect-square w-full rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center mb-2 relative">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold uppercase tracking-wider bg-red-600 px-2 py-0.5 rounded">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-amber-500 font-medium mb-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{product.rating}</span>
          <span className="text-gray-400">({product.reviewCount})</span>
        </div>

        <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 mt-0.5">{product.unit}</p>
      </Link>

      {/* Footer: Price & Add to Cart Controls */}
      <div className="p-3 pt-0 flex items-center justify-between gap-2 mt-auto">
        <div className="flex flex-col">
          {product.discountPrice ? (
            <>
              <span className="font-bold text-base text-gray-900">
                {formatCurrency(product.discountPrice)}
              </span>
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(product.price)}
              </span>
            </>
          ) : (
            <span className="font-bold text-base text-gray-900">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        {/* Quantity Controller */}
        {isOutOfStock ? (
          <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-100 px-2 py-1 rounded-lg">
            Sold Out
          </span>
        ) : quantity > 0 ? (
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 bg-brand-50 border border-brand-200 rounded-xl px-1.5 py-1">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="p-1 text-brand-700 hover:bg-brand-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                aria-label={`Decrease ${product.name} quantity`}
                type="button"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-brand-900 min-w-[16px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                disabled={isMaxStockReached}
                className="p-1 text-brand-700 hover:bg-brand-100 disabled:opacity-40 disabled:hover:bg-transparent rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                aria-label={`Increase ${product.name} quantity`}
                type="button"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {isMaxStockReached && (
              <span className="text-[9px] font-semibold text-amber-700">Max stock</span>
            )}
          </div>
        ) : (
          <button
            onClick={() => addItem(product)}
            className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-all"
            type="button"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD</span>
          </button>
        )}
      </div>
    </div>
  );
};
