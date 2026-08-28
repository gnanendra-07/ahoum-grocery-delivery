import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const SplashScreenPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/onboarding')}
      className="w-full h-full min-h-[896px] bg-[#53B175] text-white flex flex-col justify-between items-center text-center p-8 relative cursor-pointer selection:bg-none"
    >
      {/* Background Subtle Shapes */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none" />

      <div className="my-auto z-10 space-y-6">
        {/* Brand Carrot/Bag Logo Icon */}
        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl mx-auto flex items-center justify-center border border-white/30 shadow-xl">
          <ShoppingBag className="w-10 h-10 text-white" />
        </div>

        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1">
            <span>Ahoum</span>
            <span className="w-2.5 h-2.5 bg-amber-300 rounded-full inline-block mt-2" />
          </h1>
          <p className="text-sm font-medium text-emerald-100 tracking-widest uppercase">
            online groceries
          </p>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="w-full z-10 pb-8">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/onboarding');
          }}
          className="w-full py-4 bg-white hover:bg-emerald-50 text-[#53B175] text-base font-extrabold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          type="button"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
