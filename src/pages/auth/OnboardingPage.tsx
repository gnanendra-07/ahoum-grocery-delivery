import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Truck, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

// Verified fallback image sources for grocery delivery hero
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [hasImageError, setHasImageError] = useState<boolean>(false);

  const handleGetStarted = () => {
    completeOnboarding();
    navigate('/auth');
  };

  const handleImageError = () => {
    if (imageIndex < HERO_IMAGES.length - 1) {
      setImageIndex((prev) => prev + 1);
    } else {
      setHasImageError(true);
    }
  };

  return (
    <div className="w-full h-full flex-1 flex flex-col justify-between bg-white text-gray-900 overflow-hidden no-scrollbar relative">
      {/* Top Hero Image Area */}
      <div className="w-full h-[46%] relative bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-200 overflow-hidden flex-shrink-0">
        {!hasImageError ? (
          <img
            src={HERO_IMAGES[imageIndex]}
            alt="Grocery Store Delivery Worker"
            onError={handleImageError}
            className="w-full h-full object-cover object-center transition-opacity duration-300"
          />
        ) : (
          /* Guaranteed Vector Graphic Fallback for Offline / Error state */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-gradient-to-br from-emerald-600 via-brand-600 to-teal-700 text-white relative">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-xl">
              <Truck className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-1 z-10">
              <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Express 10 Min Delivery
              </div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-white pointer-events-none" />
      </div>

      {/* Content Section */}
      <div className="px-6 pb-8 pt-2 text-center flex-1 flex flex-col justify-between items-center z-10">
        {/* Brand Carrot / Icon & Heading */}
        <div className="space-y-4 pt-2">
          <div className="w-14 h-14 bg-[#53B175] text-white rounded-2xl mx-auto flex items-center justify-center shadow-md border border-emerald-100">
            <ShoppingBag className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              Welcome <br /> to our store
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-xs mx-auto leading-relaxed">
              Get your groceries as fast as one hour
            </p>
          </div>
        </div>

        {/* Green Get Started Button */}
        <div className="w-full pt-4">
          <button
            onClick={handleGetStarted}
            className="w-full py-4 bg-[#53B175] hover:bg-[#489d67] text-white text-base font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] active:scale-[0.99]"
            type="button"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
