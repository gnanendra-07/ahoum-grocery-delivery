import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Zap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const SplashScreenPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen sm:min-h-[85vh] flex flex-col justify-between items-center text-center p-6 bg-gradient-to-b from-brand-900 via-brand-800 to-brand-950 text-white sm:rounded-3xl shadow-xl overflow-hidden relative border border-brand-700/50">
      {/* Glow Effects */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Badge */}
      <div className="pt-6 z-10">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-200 text-xs font-semibold uppercase tracking-wider shadow-sm">
          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          10-Minute Express Delivery
        </span>
      </div>

      {/* Center Branding Hero */}
      <div className="space-y-5 my-auto z-10 max-w-sm">
        <div className="w-24 h-24 bg-gradient-to-tr from-brand-500 to-emerald-400 rounded-3xl mx-auto flex items-center justify-center shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-300">
          <ShoppingBag className="w-12 h-12 text-white" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Ahoum<span className="text-amber-400">.</span>
          </h1>
          <p className="text-sm sm:text-base text-brand-100 font-medium max-w-xs mx-auto leading-relaxed">
            Farm-fresh organic fruits, vegetables & daily essentials delivered straight to your door.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-brand-200/80 font-medium pt-2">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Quality
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-300" /> Express 10 Min
          </span>
        </div>
      </div>

      {/* Bottom Action Section */}
      <div className="w-full max-w-xs space-y-3 z-10 pb-4">
        {isAuthenticated ? (
          <button
            onClick={() => navigate('/')}
            className="w-full py-3.5 bg-white hover:bg-brand-50 text-brand-900 text-sm font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            type="button"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate('/onboarding')}
              className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              type="button"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/login"
              className="block w-full py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl border border-white/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Already have an account? Log In
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
