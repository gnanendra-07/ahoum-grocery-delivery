import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, ArrowRight, Smartphone } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginWithCredentials = useAuthStore((state) => state.loginWithCredentials);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
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
    <div className="max-w-md mx-auto min-h-[80vh] flex flex-col justify-between p-6 bg-white rounded-3xl border border-gray-100 shadow-md my-2 space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/auth')}
          className="p-2.5 bg-gray-50 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 mb-4"
          aria-label="Go back to auth options"
          type="button"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-gray-900">Log In to Account</h1>
          <p className="text-xs text-gray-500">
            Welcome back! Enter your login details to continue shopping.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 my-auto">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 block">Email Address</label>
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="alex.johnson@example.com"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-sm"
              autoFocus
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-700 block">Password</label>
            <button
              type="button"
              onClick={() => alert('Password reset link sent to your email!')}
              className="text-[11px] font-semibold text-brand-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-sm"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 font-medium">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-brand-600 w-4 h-4 rounded"
            />
            <span>Remember me</span>
          </label>
        </div>

        {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

        <button
          type="submit"
          className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <span>Log In</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Switch to Mobile or Sign Up */}
      <div className="space-y-2 text-center text-xs border-t border-gray-100 pt-4">
        <p className="text-gray-500 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-600 font-bold hover:underline">
            Sign Up
          </Link>
        </p>

        <button
          onClick={() => navigate('/auth/phone')}
          className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-brand-600 font-semibold pt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
          type="button"
        >
          <Smartphone className="w-3.5 h-3.5 text-brand-600" />
          <span>Or sign in using mobile OTP</span>
        </button>
      </div>
    </div>
  );
};
