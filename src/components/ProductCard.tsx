import React from 'react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';
import { Link } from 'react-router-dom';
import { Heart, Plus, Minus, Star } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../stores/useCartStore';
import { useFavoritesStore } from '../stores/useFavoritesStore';
import { formatCurrency, calculateDiscountPercentage } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = true }) => {
  const { addItem, updateQuantity, getItemQuantity } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const quantity = getItemQuantity(product.id);
  const favorite = isFavorite(product.id);
  const discountPercent = product.discountPrice
    ? calculateDiscountPercentage(product.price, product.discountPrice)
    : 0;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className={`bg-white rounded-2xl border ${isOutOfStock ? 'border-gray-200/70 opacity-75' : 'border-gray-100/90'} shadow-sm hover:shadow transition-all ${compact ? 'p-2.5' : 'p-3'} flex flex-col justify-between relative group`}>
      {/* Top Bar: Badges & Favorite */}
      <div className="flex items-center justify-between mb-0.5 z-10">
        {isOutOfStock ? (
          <span className="bg-gray-200 text-gray-500 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide">
            Out of Stock
          </span>
        ) : discountPercent > 0 ? (
          <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
            {discountPercent}% OFF
          </span>
        ) : (
          <span />
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className="p-0.5 text-gray-400 hover:text-red-500 transition-colors focus-visible:outline-none"
          aria-label={favorite ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
          type="button"
        >
          <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Image & Product Info */}
      <Link to={`/product/${product.id}`} className="block flex-1">
        <div className={`w-full ${compact ? 'h-20' : 'h-24'} flex items-center justify-center mb-1.5 overflow-hidden rounded-xl bg-gray-50/40`}>
          <img
            src={product.images[0] || FALLBACK_IMAGE}
            alt={product.name}
            className={`h-full w-full object-contain p-0.5 transition-transform duration-300 ${isOutOfStock ? 'grayscale-[40%]' : 'group-hover:scale-105'}`}
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
          />
        </div>

        <div className="flex items-center gap-1 text-[9px] text-amber-500 font-medium mb-0.5">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{product.rating}</span>
        </div>

        <h3 className="font-bold text-xs text-gray-900 line-clamp-1 leading-snug">
          {product.name}
        </h3>

        <p className="text-[10px] text-gray-400 mt-0.5">{product.unit}</p>
      </Link>

      {/* Footer: Price & Add Control */}
      <div className="flex items-center justify-between mt-1.5 pt-0.5">
        <div className="flex flex-col">
          {product.discountPrice ? (
            <>
              <span className="font-bold text-xs text-gray-900">
                {formatCurrency(product.discountPrice)}
              </span>
              <span className="text-[9px] text-gray-400 line-through">
                {formatCurrency(product.price)}
              </span>
            </>
          ) : (
            <span className="font-bold text-xs text-gray-900">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        {isOutOfStock ? (
          <span className="text-[9px] font-bold text-gray-400 uppercase bg-gray-100 px-1.5 py-0.5 rounded-lg cursor-not-allowed">
            Unavailable
          </span>
        ) : quantity > 0 ? (
          <div className="flex items-center gap-0.5 bg-emerald-50 border border-emerald-200 rounded-xl px-1.5 py-0.5">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="p-0.5 text-[#53B175]"
              type="button"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold text-gray-900 px-0.5">{quantity}</span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="p-0.5 text-[#53B175]"
              type="button"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addItem(product)}
            className="w-7 h-7 rounded-xl bg-[#53B175] hover:bg-[#489d67] text-white flex items-center justify-center shadow-sm transition-all focus-visible:outline-none active:scale-95"
            type="button"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        )}
      </div>
    </div>
  );
};
