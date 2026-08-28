import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { formatCurrency } from '../utils/formatters';
import { X, ChevronRight, CreditCard, Wifi, Signal, Battery } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, deliveryFee, getTotalAmount, clearCart } = useCartStore();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const subtotal = getSubtotal();
  const total = getTotalAmount() > 0 ? getTotalAmount() : subtotal > 0 ? subtotal + deliveryFee : 12.96;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      clearCart();
      navigate('/order-accepted', {
        state: {
          orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          total,
          itemCount: items.reduce((s, i) => s + i.quantity, 0),
        },
      });
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white h-full flex flex-col justify-between py-3 px-6 select-none">
      <div className="space-y-3 max-w-[364px] mx-auto w-full">
        {/* 1. Status Bar / Top Safe Area */}
        <div className="flex items-center justify-between text-xs font-semibold text-gray-900 pt-1">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-gray-800">
            <Signal className="w-3.5 h-3.5 fill-gray-800" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-gray-800" />
          </div>
        </div>

        {/* 2. Header */}
        <div className="flex items-center justify-between pt-1 pb-3 border-b border-gray-100">
          <div className="w-5" />
          <h1 className="text-base font-bold text-gray-900 text-center flex-1">
            Checkout
          </h1>
          <button
            onClick={() => navigate('/cart')}
            className="p-1 text-gray-800 hover:text-gray-900 transition-colors focus-visible:outline-none"
            aria-label="Close checkout"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3. Checkout Rows (Each ~48-52px tall, thin light-gray dividers) */}
        <div className="divide-y divide-gray-100">
          {/* 1. Delivery */}
          <div className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors min-h-[50px]">
            <span className="text-xs font-semibold text-gray-400">Delivery</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-900">Select Method</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* 2. Payment (Only card icon, no text) */}
          <div className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors min-h-[50px]">
            <span className="text-xs font-semibold text-gray-400">Payment</span>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-900" />
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* 3. Promo Code */}
          <div className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors min-h-[50px]">
            <span className="text-xs font-semibold text-gray-400">Promo Code</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-900">Pick discount</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* 4. Total Cost */}
          <div className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors min-h-[50px]">
            <span className="text-xs font-semibold text-gray-400">Total Cost</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-900">
                {formatCurrency(total)}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* 4. Terms & Conditions Text */}
        <div className="pt-3 text-[11px] text-gray-400 leading-normal">
          By placing an order you agree to our{' '}
          <span className="font-bold text-gray-900 cursor-pointer hover:underline">
            Terms And Conditions
          </span>
        </div>
      </div>

      {/* 5. Place Order Button (364px width, 48px height, rounded-2xl, #53B175) */}
      <div className="pt-4 pb-4 max-w-[364px] mx-auto w-full">
        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="w-full h-12 bg-[#53B175] hover:bg-[#489d67] disabled:opacity-50 text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center focus-visible:outline-none active:scale-[0.99]"
          type="button"
        >
          {isProcessing ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};
