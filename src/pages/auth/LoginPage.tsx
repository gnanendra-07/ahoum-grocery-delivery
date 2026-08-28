import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ShoppingBag, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginWithCredentials = useAuthStore((state) => state.loginWithCredentials);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setError(null);
    loginWithCredentials(email);
    navigate('/');
  };

  return (
    <div className="w-full h-full min-h-[896px] bg-white text-gray-900 flex flex-col justify-between p-6 relative">
      {/* Top Bar with Back Chevron */}
      <div>
        <button
          onClick={() => navigate('/auth')}
          className="p-2 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] mb-4"
          aria-label="Go back to auth choices"
          type="button"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Brand Icon Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 bg-emerald-50 text-[#53B175] rounded-2xl mx-auto flex items-center justify-center border border-emerald-100 shadow-sm">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 pt-1">Log In</h1>
          <p className="text-xs text-gray-500 font-medium">Enter your email address and password</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 my-auto">
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
            className="w-full p-3.5 bg-gray-50 border-b-2 border-gray-200 text-sm font-bold text-gray-900 focus:border-[#53B175] focus:bg-white focus:outline-none transition-colors"
            autoFocus
            required
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-500 block">Password</label>
            <button
              type="button"
              onClick={() => alert('Password reset link sent to your email!')}
              className="text-xs font-bold text-gray-700 hover:text-[#53B175] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] rounded"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••"
              className="w-full p-3.5 pr-10 bg-gray-50 border-b-2 border-gray-200 text-sm font-bold text-gray-900 focus:border-[#53B175] focus:bg-white focus:outline-none transition-colors"
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

        {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

        <button
          type="submit"
          className="w-full py-4 bg-[#53B175] hover:bg-[#489d67] text-white text-base font-extrabold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
        >
          <span>Log In</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      {/* Footer Switch to Sign Up */}
      <div className="pb-4 text-center text-xs font-bold text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="text-[#53B175] hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
};
