/**
 * @deprecated UNUSED — This file is NOT registered in AppRoutes.tsx.
 * The active Sign In landing screen is SignInPage.tsx (route: /auth).
 * AuthLandingPage.tsx is a near-duplicate of SignInPage.tsx that was kept
 * as a reference but is dead code. Do not add new logic here.
 */
import React from 'react';

import { useNavigate } from 'react-router-dom';
import { Wifi, Signal, Battery } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

// Hero Grocery Image matching Figma reference
const SIGNIN_HERO_IMAGE =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';

const GoogleIcon: React.FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#FFFFFF"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#FFFFFF"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FFFFFF"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#FFFFFF"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const FacebookIcon: React.FC = () => (
  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const FlagIcon: React.FC = () => (
  <div className="w-6 h-4 rounded-sm overflow-hidden flex items-center justify-center bg-[#006A4E] relative flex-shrink-0 shadow-sm border border-gray-200">
    <div className="w-2.5 h-2.5 bg-[#F42A41] rounded-full" />
  </div>
);

export const AuthLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const loginMockUser = useAuthStore((state) => state.loginMockUser);

  const handleSocialLogin = () => {
    loginMockUser();
    navigate('/home');
  };

  return (
    <div className="bg-white h-full flex flex-col justify-between py-3 px-6 select-none relative overflow-hidden text-gray-900">
      <div className="space-y-4 w-full max-w-[364px] mx-auto">
        {/* 1. Status Bar */}
        <div className="flex items-center justify-between text-xs font-semibold text-gray-900 pt-1">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-gray-800">
            <Signal className="w-3.5 h-3.5 fill-gray-800" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-gray-800" />
          </div>
        </div>

        {/* 2. Top Grocery Hero Image */}
        <div className="w-full h-56 rounded-3xl overflow-hidden relative bg-gray-50 shadow-sm">
          <img
            src={SIGNIN_HERO_IMAGE}
            alt="Fresh Groceries"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
        </div>

        {/* 3. Main Heading */}
        <div className="pt-1">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
            Get your groceries<br />with nectar
          </h1>
        </div>

        {/* 4. Phone Input Selector Row */}
        <div
          onClick={() => navigate('/auth/phone')}
          className="pt-2 pb-3 border-b border-gray-200 cursor-pointer flex items-center gap-3 hover:border-[#53B175] transition-colors"
        >
          <FlagIcon />
          <span className="text-sm font-semibold text-gray-900">+880</span>
        </div>

        {/* 5. Social Connect Divider Text */}
        <div className="pt-4 text-center">
          <span className="text-xs font-semibold text-gray-400">
            Or connect with social media
          </span>
        </div>

        {/* 6. Social Login Buttons Stack */}
        <div className="space-y-3 pt-2">
          {/* Google Button */}
          <button
            onClick={handleSocialLogin}
            className="w-full h-13 py-3.5 bg-[#5383EC] hover:bg-[#4672cf] active:scale-[0.99] text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-3 focus-visible:outline-none relative px-4"
            type="button"
          >
            <div className="absolute left-6">
              <GoogleIcon />
            </div>
            <span className="text-center w-full">Continue with Google</span>
          </button>

          {/* Facebook Button */}
          <button
            onClick={handleSocialLogin}
            className="w-full h-13 py-3.5 bg-[#4A66AC] hover:bg-[#3f5793] active:scale-[0.99] text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-3 focus-visible:outline-none relative px-4"
            type="button"
          >
            <div className="absolute left-6">
              <FacebookIcon />
            </div>
            <span className="text-center w-full">Continue with Facebook</span>
          </button>
        </div>
      </div>

      {/* 7. Bottom iOS Home Indicator */}
      <div className="w-full pb-2 max-w-[364px] mx-auto flex justify-center">
        <div className="w-32 h-1 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
};
