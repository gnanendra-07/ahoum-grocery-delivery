import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);

  const handleNext = () => {
    completeOnboarding();
    navigate('/auth');
  };

  return (
    <div className="w-full h-full min-h-[896px] bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
      {/* Top Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
          alt="Fresh Grocery Store Basket"
          className="w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
      </div>

      {/* Top Header Skip Button */}
      <div className="p-6 z-10 flex justify-end">
        <button
          onClick={handleNext}
          className="text-xs font-bold text-gray-300 hover:text-white bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          type="button"
        >
          Skip
        </button>
      </div>

      {/* Bottom Content Area */}
      <div className="p-8 z-10 text-center space-y-6 pb-12">
        <div className="w-16 h-16 bg-[#53B175] text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg border border-white/20">
          <ShoppingBag className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Welcome <br /> to our store
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xs mx-auto font-medium leading-relaxed">
            Get your groceries as fast as one hour with express dark-store delivery.
          </p>
        </div>

        <button
          onClick={handleNext}
          className="w-full py-4 bg-[#53B175] hover:bg-[#489d67] text-white text-base font-extrabold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          type="button"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
