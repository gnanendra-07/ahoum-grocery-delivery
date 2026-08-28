import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Home, Clock } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface SuccessState {
  orderId?: string;
  total?: number;
  itemCount?: number;
  paymentMethod?: string;
}

export const CheckoutSuccessPage: React.FC = () => {
  const location = useLocation();
  const state = (location.state as SuccessState) || {};

  const orderId = state.orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const total = state.total || 0;

  return (
    <div className="space-y-6 py-8 text-center max-w-xl mx-auto">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-bounce">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
          Order Confirmed
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 pt-2">Thank You For Your Order!</h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
          Your fresh groceries are being picked right now and will arrive in 10 minutes.
        </p>
      </div>

      {/* Details Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left space-y-3 text-xs sm:text-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <span className="text-gray-500 font-medium">Order Reference</span>
          <span className="font-mono font-bold text-gray-900">{orderId}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 font-medium flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-600" /> Estimated Delivery
          </span>
          <span className="font-bold text-brand-600">8-12 Minutes</span>
        </div>
        {total > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-gray-500 font-medium">Amount Paid</span>
            <span className="font-bold text-gray-900">{formatCurrency(total)}</span>
          </div>
        )}
      </div>

      <div className="pt-2">
        <Link
          to="/"
          className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};
