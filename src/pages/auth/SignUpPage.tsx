import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Smartphone, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const signUpUser = useAuthStore((state) => state.signUpUser);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phone || phone.length < 7) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }
    if (!agreeTerms) {
      setError('You must accept the Terms & Conditions to create an account.');
      return;
    }

    setError(null);
    signUpUser(name.trim(), email.trim(), phone.trim());
    navigate('/auth/location');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen sm:min-h-[80vh] flex flex-col justify-between p-6 bg-white sm:rounded-3xl border border-gray-100 shadow-md space-y-6">
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
          <h1 className="text-2xl font-black text-gray-900">Create New Account</h1>
          <p className="text-xs text-gray-500">
            Sign up to get fresh groceries delivered in 10 minutes.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5 my-auto">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 block">Full Name</label>
          <div className="relative">
            <User className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Alex Johnson"
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-sm"
              autoFocus
              required
            />
          </div>
        </div>

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
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 block">Mobile Phone</label>
          <div className="relative">
            <Smartphone className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (error) setError(null);
              }}
              placeholder="+1 (555) 019-2834"
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 block">Password</label>
          <div className="relative">
            <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Create a strong password"
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-sm"
              required
            />
          </div>
        </div>

        <div className="pt-1">
          <label className="flex items-start gap-2 cursor-pointer text-[11px] text-gray-600 leading-snug">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="accent-brand-600 w-4 h-4 rounded mt-0.5"
            />
            <span>
              I agree to the Ahoum <span className="font-bold text-brand-600">Terms of Service</span> and{' '}
              <span className="font-bold text-brand-600">Privacy Policy</span>.
            </span>
          </label>
        </div>

        {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

        <button
          type="submit"
          className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <span>Create Account</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Footer Switch */}
      <div className="text-center text-xs border-t border-gray-100 pt-4">
        <p className="text-gray-500 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-bold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};
