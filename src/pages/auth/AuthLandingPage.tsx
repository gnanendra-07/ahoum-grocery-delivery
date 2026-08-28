import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Mail, UserPlus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const AuthLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const loginMockUser = useAuthStore((state) => state.loginMockUser);

  const handleGuest = () => {
    loginMockUser();
    navigate('/');
  };

  return (
    <div className="w-full h-full min-h-[896px] bg-white text-gray-900 flex flex-col justify-between relative overflow-hidden">
      {/* Top Banner Image */}
      <div className="h-64 w-full relative bg-gray-100 flex-shrink-0">
        <img
          src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
          alt="Fresh Farm Produce"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
      </div>

      {/* Content Body */}
      <div className="px-6 py-4 space-y-6 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#53B175]">
            <ShoppingBag className="w-6 h-6" />
            <span className="text-xl font-extrabold tracking-tight">Ahoum</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
            Get your groceries <br /> with Ahoum
          </h2>

          {/* Fake Phone Input Field Trigger */}
          <div
            onClick={() => navigate('/auth/phone')}
            className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer flex items-center justify-between hover:border-[#53B175] transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-base font-bold text-gray-700">🇺🇸 +1</span>
              <span className="text-sm font-semibold text-gray-400">Enter mobile number</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#53B175]" />
          </div>
        </div>

        {/* Buttons Stack */}
        <div className="space-y-3 pb-6">
          <button
            onClick={() => navigate('/auth/phone')}
            className="w-full py-4 bg-[#53B175] hover:bg-[#489d67] text-white text-sm font-extrabold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
            type="button"
          >
            <Smartphone className="w-4 h-4" />
            <span>Continue with Mobile Number</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/login')}
              className="py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-2xl border border-gray-200 transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              type="button"
            >
              <Mail className="w-4 h-4 text-gray-600" />
              <span>Log In</span>
            </button>

            <button
              onClick={() => navigate('/signup')}
              className="py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-2xl border border-gray-200 transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              type="button"
            >
              <UserPlus className="w-4 h-4 text-gray-600" />
              <span>Sign Up</span>
            </button>
          </div>

          <button
            onClick={handleGuest}
            className="w-full py-3 text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] rounded"
            type="button"
          >
            Continue as Guest & Explore →
          </button>
        </div>
      </div>
    </div>
  );
};
