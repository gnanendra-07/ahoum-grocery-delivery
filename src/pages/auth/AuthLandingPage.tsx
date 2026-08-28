import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Mail, UserPlus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const AuthLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const loginMockUser = useAuthStore((state) => state.loginMockUser);

  const handleGuestEntry = () => {
    loginMockUser();
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen sm:min-h-[80vh] flex flex-col justify-between p-6 bg-white sm:rounded-3xl border border-gray-100 shadow-md relative overflow-hidden">
      {/* Top Header branding */}
      <div className="text-center space-y-3 pt-4">
        <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-brand-100">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-gray-900">Welcome to Ahoum</h1>
        <p className="text-xs text-gray-500 max-w-xs mx-auto">
          Sign in or create an account to unlock 10-minute delivery and personalized offers.
        </p>
      </div>

      {/* Main Options Stack */}
      <div className="space-y-3 my-auto py-6">
        <button
          onClick={() => navigate('/auth/phone')}
          className="w-full p-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          type="button"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="block font-bold">Continue with Mobile</span>
              <span className="text-[11px] text-brand-100 font-normal">Fast 4-digit OTP verification</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => navigate('/login')}
          className="w-full p-4 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-2xl font-bold text-xs sm:text-sm border border-gray-200 transition-all flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          type="button"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-200/70 text-gray-700 rounded-xl">
              <Mail className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="block font-bold">Log In with Password</span>
              <span className="text-[11px] text-gray-500 font-normal">Existing email or member ID</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => navigate('/signup')}
          className="w-full p-4 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-2xl font-bold text-xs sm:text-sm border border-gray-200 transition-all flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          type="button"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 text-brand-700 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="block font-bold">Create New Account</span>
              <span className="text-[11px] text-gray-500 font-normal">Sign up for fresh delivery</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Guest / Footer Action */}
      <div className="space-y-3 text-center border-t border-gray-100 pt-4">
        <button
          onClick={handleGuestEntry}
          className="text-xs font-bold text-gray-500 hover:text-brand-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded px-2 py-1"
          type="button"
        >
          Continue as Guest & Explore Catalog →
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure SSL Encrypted Connection</span>
        </div>
      </div>
    </div>
  );
};
