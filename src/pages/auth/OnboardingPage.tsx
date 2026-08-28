import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Truck, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

// Verified delivery worker hero image sources matching Figma onboarding design
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1583258292688-d0213267377b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?auto=format&fit=crop&w=800&q=80',
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
    <div className="w-full h-full min-h-[80vh] flex-1 flex flex-col justify-between bg-white text-gray-900 overflow-hidden relative">
      {/* Top Hero Delivery Worker Image Section */}
      <div className="w-full h-[52%] min-h-[320px] relative bg-[#53B175]/10 overflow-hidden flex-shrink-0">
        {!hasImageError ? (
          <img
            src={HERO_IMAGES[imageIndex]}
            alt="Grocery Delivery Worker"
            onError={handleImageError}
            className="w-full h-full object-cover object-top transition-opacity duration-300"
          />
        ) : (
          /* Fallback for Offline / Error state */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-gradient-to-br from-emerald-600 via-[#53B175] to-teal-700 text-white relative">
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white pointer-events-none" />
      </div>

      {/* Content Section */}
      <div className="px-6 pb-8 pt-0 text-center flex-1 flex flex-col justify-between items-center z-10">
        {/* Brand Carrot / Icon & Heading Stack */}
        <div className="space-y-3 -mt-7 flex flex-col items-center">
          <div className="w-12 h-12 bg-[#53B175] text-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-white">
            <ShoppingBag className="w-6 h-6" />
          </div>

          <div className="space-y-1.5 pt-1">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              Welcome <br /> to our store
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-[260px] mx-auto leading-relaxed">
              Get your groceries as fast as one hour
            </p>
          </div>
        </div>

        {/* Green Get Started Button */}
        <div className="w-full pt-4 max-w-sm">
          <button
            onClick={handleGetStarted}
            className="w-full py-4 bg-[#53B175] hover:bg-[#489d67] text-white text-base font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2 active:scale-[0.99]"
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
