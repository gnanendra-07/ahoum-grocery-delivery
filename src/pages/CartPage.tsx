import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { formatCurrency } from '../utils/formatters';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getTaxAmount,
    deliveryFee,
    getTotalAmount,
  } = useCartStore();

  const subtotal = getSubtotal();
  const tax = getTaxAmount();
  const total = getTotalAmount();

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 my-6 space-y-3 max-w-lg mx-auto shadow-sm">
        <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-xs text-gray-500 max-w-xs mx-auto">
          Looks like you haven't added any fresh groceries to your cart yet.
        </p>
        <Link
          to="/"
          className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Shopping Cart ({items.length} items)</h1>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-2 py-1"
          type="button"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      {/* Responsive 2-Column Container for Desktop */}
      <div className="md:grid md:grid-cols-3 md:gap-8 md:items-start space-y-6 md:space-y-0">
        {/* Left Column (2 cols): Cart Item List */}
        <div className="md:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => {
            const itemPrice = product.discountPrice ?? product.price;
            const isMaxStock = quantity >= product.stock;

            return (
              <div
                key={product.id}
                className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between gap-4"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-20 h-20 rounded-2xl object-cover bg-gray-50 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">{product.name}</h3>
                  <span className="text-xs text-gray-500 font-medium block">{product.unit}</span>
                  <span className="text-sm font-extrabold text-gray-900 mt-1 block">
                    {formatCurrency(itemPrice)}
                  </span>
                </div>

                {/* Quantity controller */}
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-xl px-2 py-1">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1 text-brand-700 hover:bg-brand-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                      type="button"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-brand-900 min-w-[16px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={isMaxStock}
                      className="p-1 text-brand-700 hover:bg-brand-100 disabled:opacity-40 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                      type="button"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {isMaxStock && (
                    <span className="text-[9px] font-semibold text-amber-700">Max stock</span>
                  )}
                </div>

                <button
                  onClick={() => removeItem(product.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg"
                  aria-label={`Remove ${product.name} from cart`}
                  type="button"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Column (1 col): Bill Breakdown & Checkout Action */}
        <div className="md:col-span-1 md:sticky md:top-24 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3 text-xs sm:text-sm">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 text-sm">
              Bill Summary
            </h3>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee (10-Min Express)</span>
              <span className="font-medium text-gray-900">{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Est. Taxes (5%)</span>
              <span className="font-medium text-gray-900">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-gray-900 pt-3 border-t border-gray-100">
              <span>To Pay</span>
              <span className="text-brand-600">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            type="button"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
