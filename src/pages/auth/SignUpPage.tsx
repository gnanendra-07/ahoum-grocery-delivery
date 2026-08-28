import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Wifi, Signal, Battery, Eye, EyeOff, Check, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

const CarrotLogoMark: React.FC = () => (
  <svg className="w-10 h-12 flex-shrink-0" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M26.5 49.5C26.5 49.5 39 31 38 18.5C37 6 24 9.5 24 9.5C24 9.5 11 6 10 18.5C9 31 21.5 49.5 21.5 49.5C22.5 51 25.5 51 26.5 49.5Z"
      fill="#F37A20"
    />
    <path
      d="M21 11C21 11 17 2 9 4C9 4 14 10 20 11.5Z"
      fill="#53B175"
    />
    <path
      d="M24 11C24 11 28 2 36 4C36 4 31 10 25 11.5Z"
      fill="#53B175"
    />
  </svg>
);

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const signUpUser = useAuthStore((state) => state.signUpUser);

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your username.');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setError(null);
    signUpUser(username.trim(), email.trim(), '+1 (555) 019-2834');
    navigate('/auth/location');
  };

  const isEmailValid = email.length > 3 && email.includes('@');

  return (
    <div className="bg-white h-full flex flex-col justify-between py-3 px-6 select-none relative overflow-hidden text-gray-900">
      <div className="space-y-3 w-full max-w-[364px] mx-auto flex-1 flex flex-col">
        {/* 1. Status Bar */}
        <div className="flex items-center justify-between text-xs font-semibold text-gray-900 pt-1">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-gray-800">
            <Signal className="w-3.5 h-3.5 fill-gray-800" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-gray-800" />
          </div>
        </div>

        {/* Back Chevron */}
        <div className="pt-1">
          <button
            onClick={() => navigate('/auth')}
            className="p-1 -ml-1 text-gray-900 hover:text-gray-600 transition-colors focus-visible:outline-none"
            aria-label="Go back"
            type="button"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        {/* 2. Centered Carrot Logo */}
        <div className="flex justify-center pt-4 pb-1">
          <CarrotLogoMark />
        </div>

        {/* 3. Heading & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Sign Up
          </h1>
          <p className="text-xs font-semibold text-gray-400">
            Enter your credentials to continue
          </p>
        </div>

        {/* 4. Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 block">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Aftab Hossain"
              className="w-full bg-transparent text-sm font-semibold text-gray-900 border-b border-gray-200 focus-within:border-[#53B175] pb-2 focus:outline-none transition-colors"
              autoFocus
              required
            />
          </div>

          {/* Email Field with Green Check Indicator */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-gray-400 block">
              Email
            </label>
            <div className="relative border-b border-gray-200 focus-within:border-[#53B175] pb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="imran@gmail.com"
                className="w-full bg-transparent text-sm font-semibold text-gray-900 pr-8 focus:outline-none transition-colors"
                required
              />
              {isEmailValid && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <Check className="w-4 h-4 text-[#53B175] stroke-[3]" />
                </div>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-gray-400 block">
              Password
            </label>
            <div className="relative border-b border-gray-200 focus-within:border-[#53B175] pb-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm font-semibold text-gray-900 pr-8 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus-visible:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>

          {/* Terms Text */}
          <div className="pt-2 text-[11px] text-gray-400 leading-relaxed">
            By continuing you agree to our{' '}
            <span className="text-[#53B175] font-semibold cursor-pointer hover:underline">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="text-[#53B175] font-semibold cursor-pointer hover:underline">
              Privacy Policy
            </span>
            .
          </div>

          {error && <p className="text-xs text-red-600 font-medium pt-1">{error}</p>}

          {/* Primary Green Sign Up Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full h-12 bg-[#53B175] hover:bg-[#489d67] active:scale-[0.99] text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center focus-visible:outline-none"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="pt-4 text-center text-xs font-semibold text-gray-900">
          Already have an account?{' '}
          <Link to="/login" className="text-[#53B175] font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </div>

      {/* 5. Bottom iOS Home Indicator */}
      <div className="w-full max-w-[364px] mx-auto pb-1 flex justify-center z-10">
        <div className="w-32 h-1 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
};
