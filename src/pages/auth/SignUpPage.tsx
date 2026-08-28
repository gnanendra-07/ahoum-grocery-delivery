import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ShoppingBag, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const signUpUser = useAuthStore((state) => state.signUpUser);

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
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
    if (!agreeTerms) {
      setError('You must accept Terms of Service.');
      return;
    }

    setError(null);
    signUpUser(username.trim(), email.trim(), '+1 (555) 019-2834');
    navigate('/auth/location');
  };

  return (
    <div className="w-full h-full min-h-[896px] bg-white text-gray-900 flex flex-col justify-between p-6 relative">
      {/* Top Bar with Back Chevron */}
      <div>
        <button
          onClick={() => navigate('/auth')}
          className="p-2 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] mb-2"
          aria-label="Go back to auth choices"
          type="button"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Brand Icon Header */}
        <div className="text-center space-y-2 mb-4">
          <div className="w-14 h-14 bg-emerald-50 text-[#53B175] rounded-2xl mx-auto flex items-center justify-center border border-emerald-100 shadow-sm">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 pt-1">Sign Up</h1>
          <p className="text-xs text-gray-500 font-medium">Enter your credentials to continue</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 my-auto">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 block">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Aftab Hossain"
            className="w-full p-3 bg-gray-50 border-b-2 border-gray-200 text-sm font-bold text-gray-900 focus:border-[#53B175] focus:bg-white focus:outline-none transition-colors"
            autoFocus
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder="imran@gmail.com"
            className="w-full p-3 bg-gray-50 border-b-2 border-gray-200 text-sm font-bold text-gray-900 focus:border-[#53B175] focus:bg-white focus:outline-none transition-colors"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 block">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••"
              className="w-full p-3 pr-10 bg-gray-50 border-b-2 border-gray-200 text-sm font-bold text-gray-900 focus:border-[#53B175] focus:bg-white focus:outline-none transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] rounded"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-2 cursor-pointer text-xs text-gray-600 font-medium leading-snug">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="accent-[#53B175] w-4 h-4 rounded mt-0.5"
            />
            <span>
              By continuing you agree to our{' '}
              <span className="text-[#53B175] font-bold">Terms of Service</span> and{' '}
              <span className="text-[#53B175] font-bold">Privacy Policy</span>.
            </span>
          </label>
        </div>

        {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

        <button
          type="submit"
          className="w-full py-4 bg-[#53B175] hover:bg-[#489d67] text-white text-base font-extrabold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
        >
          <span>Sign Up</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      {/* Footer Switch to Log In */}
      <div className="pb-4 text-center text-xs font-bold text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-[#53B175] hover:underline">
          Log In
        </Link>
      </div>
    </div>
  );
};
