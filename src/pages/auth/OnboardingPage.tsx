import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);

  const handleGetStarted = () => {
    completeOnboarding();
    navigate('/auth');
  };

  return (
    <div className="w-full h-full flex-1 flex flex-col justify-between bg-white text-gray-900 overflow-hidden no-scrollbar relative">
      {/* Top Grocery Delivery Worker Image Section */}
      <div className="w-full h-[46%] relative bg-emerald-50 overflow-hidden flex-shrink-0">
        <img
          src="https://images.unsplash.com/photo-1583258292688-d0213267377b?auto=format&fit=crop&w=800&q=80"
          alt="Grocery Delivery Worker"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-white" />
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
