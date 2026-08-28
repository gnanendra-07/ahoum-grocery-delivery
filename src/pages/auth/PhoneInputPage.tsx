import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const PhoneInputPage: React.FC = () => {
  const navigate = useNavigate();
  const setTempPhone = useAuthStore((state) => state.setTempPhone);

  const [countryCode, setCountryCode] = useState<string>('+1');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 7) {
      setError('Please enter a valid phone number (at least 7 digits).');
      return;
    }
    setError(null);
    const fullPhone = `${countryCode} ${phoneNumber}`;
    setTempPhone(fullPhone);
    navigate('/auth/verify');
  };

  return (
    <div className="max-w-md mx-auto min-h-[80vh] flex flex-col justify-between p-6 bg-white rounded-3xl border border-gray-100 shadow-md my-2 space-y-6">
      {/* Header with Back button */}
      <div>
        <button
          onClick={() => navigate('/auth')}
          className="p-2.5 bg-gray-50 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 mb-4"
          aria-label="Go back"
          type="button"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
            Step 1 of 3
          </span>
          <h1 className="text-2xl font-black text-gray-900 pt-1">Enter Mobile Number</h1>
          <p className="text-xs text-gray-500">
            We will send a 4-digit verification code to verify your phone.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4 my-auto">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 block">Mobile Phone Number</label>
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              aria-label="Country code selector"
              className="bg-gray-50 border border-gray-200 text-gray-900 text-xs font-bold rounded-2xl px-3 py-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <option value="+1">🇺🇸 +1</option>
              <option value="+91">🇮🇳 +91</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+61">🇦🇺 +61</option>
            </select>

            <div className="relative flex-1">
              <Smartphone className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="(555) 019-2834"
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-sm"
                autoFocus
                required
              />
            </div>
          </div>
          {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <span>Send Verification Code</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Footer Info */}
      <div className="text-center text-[11px] text-gray-400 space-y-1 border-t border-gray-100 pt-4">
        <p className="flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          By continuing, you agree to receive SMS verification messages.
        </p>
      </div>
    </div>
  );
};
