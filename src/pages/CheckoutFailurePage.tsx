import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, ShoppingBag } from 'lucide-react';

interface FailureState {
  errorMessage?: string;
  total?: number;
}

export const CheckoutFailurePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as FailureState) || {};

  const errorMessage =
    state.errorMessage || 'Your payment could not be processed. Please try again.';

  return (
    <div className="space-y-6 py-8 text-center max-w-xl mx-auto">
      <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <XCircle className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-red-700 bg-red-50 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
          Payment Failed
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 pt-2">Order Could Not Be Placed</h1>
        <p className="text-xs sm:text-sm text-red-600 max-w-sm mx-auto font-medium">{errorMessage}</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left text-xs sm:text-sm space-y-2">
        <h4 className="font-semibold text-gray-900">What can you do?</h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Check your internet connection and network connectivity.</li>
          <li>Try selecting a different payment method (e.g. UPI or COD).</li>
          <li>Disable the mock API failure simulation toggle in the header.</li>
        </ul>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate('/checkout')}
          className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          type="button"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Checkout</span>
        </button>

        <Link
          to="/cart"
          className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm rounded-2xl transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Return to Cart</span>
        </Link>
      </div>
    </div>
  );
};
