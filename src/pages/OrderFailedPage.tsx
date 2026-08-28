import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

export const OrderFailedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white h-full flex flex-col items-center justify-between pt-16 pb-3 px-4 text-center select-none relative overflow-hidden">
      {/* Decorative soft pastel background glow */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-72 h-72 bg-red-50/70 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Top Group: Failure Illustration, Title & Description */}
      <div className="flex flex-col items-center w-full">
        {/* 1. Failure Illustration with decorative accent dots */}
        <div className="relative flex items-center justify-center my-3">
          {/* Accent decorative dots around circle */}
          <div className="absolute -top-3 -left-3 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
          <div className="absolute top-3 -right-6 w-2.5 h-2.5 bg-red-300 rounded-full" />
          <div className="absolute -bottom-3 -left-5 w-3.5 h-3.5 bg-orange-400 rounded-full" />
          <div className="absolute bottom-2 -right-4 w-3 h-3 bg-rose-400 rounded-full" />

          {/* Large Circular Red Failure Icon */}
          <div className="w-28 h-28 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-200/80">
            <X className="w-14 h-14 stroke-[3.5]" />
          </div>
        </div>

        {/* 2. Failure Title & 3. Description */}
        <div className="mt-6 space-y-2 max-w-xs mx-auto">
          <h1 className="text-lg font-bold text-gray-900 leading-snug">
            Oops! Order Failed
          </h1>
          <p className="text-[11px] text-gray-400 leading-normal max-w-[240px] mx-auto">
            Something went wrong. Please try again<br />or check your payment details.
          </p>
        </div>
      </div>

      {/* Action Group: Try Again Button & Back to Home */}
      <div className="space-y-3.5 w-full max-w-[382px] mx-auto pb-1">
        <button
          onClick={() => navigate('/checkout')}
          className="w-full h-12 bg-[#53B175] hover:bg-[#489d67] active:scale-[0.99] text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2"
          type="button"
        >
          Try Again
        </button>

        <button
          onClick={() => navigate('/home')}
          className="text-xs font-bold text-gray-900 hover:text-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1 block w-full text-center py-1"
          type="button"
        >
          Back to home
        </button>
      </div>
    </div>
  );
};
