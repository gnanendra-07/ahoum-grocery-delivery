import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

export const OrderAcceptedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleTrackOrder = () => {
    // Placeholder: navigates to home until real order-tracking backend is implemented
    navigate('/home');
  };

  return (
    <div className="bg-white h-full flex flex-col items-center justify-between pt-16 pb-3 px-4 text-center select-none relative overflow-hidden">
      {/* Decorative soft pastel background glow */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-50/70 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Top Group: Success Illustration, Title & Description (EXACT SAME POSITION) */}
      <div className="flex flex-col items-center w-full">
        {/* 1. Success Illustration with decorative accent dots */}
        <div className="relative flex items-center justify-center my-3">
          {/* Accent decorative dots around circle */}
          <div className="absolute -top-3 -left-3 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
          <div className="absolute top-3 -right-6 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          <div className="absolute -bottom-3 -left-5 w-3.5 h-3.5 bg-red-400 rounded-full" />
          <div className="absolute bottom-2 -right-4 w-3 h-3 bg-sky-400 rounded-full" />

          {/* Large Circular Green Check Icon */}
          <div className="w-28 h-28 bg-[#53B175] text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-200/80">
            <Check className="w-14 h-14 stroke-[3.5]" />
          </div>
        </div>

        {/* 2. Success Title & 3. Description */}
        <div className="mt-6 space-y-2 max-w-xs mx-auto">
          <h1 className="text-lg font-bold text-gray-900 leading-snug">
            Your Order has been<br />accepted
          </h1>
          <p className="text-[11px] text-gray-400 leading-normal max-w-[240px] mx-auto">
            Your items are on their way and is on<br />it's way to you
          </p>
        </div>
      </div>

      {/* Action Group: Track Order Button & Back to Home (Moved ~56px DOWN) */}
      <div className="space-y-3.5 w-full max-w-[382px] mx-auto pb-1">
        <button
          onClick={handleTrackOrder}
          className="w-full h-12 bg-[#53B175] hover:bg-[#489d67] active:scale-[0.99] text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2"
          type="button"
        >
          Track Order
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
