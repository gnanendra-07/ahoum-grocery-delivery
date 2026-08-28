import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { formatCurrency } from '../utils/formatters';
import { X, Plus, Minus, Wifi, Signal, Battery, ShoppingCart } from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem } = useCartStore();

  const subtotal = items.reduce(
    (acc, item) => acc + (item.product.discountPrice ?? item.product.price) * item.quantity,
    0
  );

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

      {/* 2. Header: My Cart */}
      <div className="pt-0.5 pb-2 border-b border-gray-100">
        <h1 className="text-base font-bold text-gray-900 text-center">
          My Cart
        </h1>
      </div>

      {items.length === 0 ? (
        /* 3. Empty Cart State */
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-gray-900">Your cart is empty</h2>
            <p className="text-xs text-gray-400 max-w-[220px] leading-relaxed">
              Add items to your cart to see them here.
            </p>
          </div>
          <Link
            to="/home"
            className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-[#53B175] hover:bg-[#489d67] text-white text-xs font-bold rounded-2xl shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* 3. Cart Product List */}
          <div className="space-y-2.5 pt-1">
            {items.map(({ product, quantity }) => {
              const price = product.discountPrice ?? product.price;

              return (
                <div
                  key={product.id}
                  className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-3"
                >
                  {/* Product Image */}
                  <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50/50 flex-shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain p-1"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  </div>

                  {/* Product Info & Quantity Controls */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-xs text-gray-900 truncate">
                          {product.name}
                        </h3>
                        <p className="text-[10px] text-gray-400">
                          {product.unit}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(product.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors focus-visible:outline-none"
                        aria-label={`Remove ${product.name}`}
                        type="button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity Controls & Price Row */}
                    <div className="flex items-center justify-between pt-0.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-7 h-7 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 transition-colors focus-visible:outline-none"
                          type="button"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <span className="text-xs font-bold text-gray-900 w-4 text-center">
                          {quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-7 h-7 rounded-xl border border-[#53B175] bg-white hover:bg-emerald-50 flex items-center justify-center text-[#53B175] transition-colors focus-visible:outline-none"
                          type="button"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>

                      <span className="font-bold text-xs text-gray-900">
                        {formatCurrency(price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4. Green Go to Checkout Button */}
          <div className="pt-3">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#53B175] hover:bg-[#489d67] text-white text-xs font-bold py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2 active:scale-[0.99]"
              type="button"
            >
              <span className="text-sm font-bold">Go to Checkout</span>
              <span className="bg-[#489d67] text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                {formatCurrency(subtotal)}
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
