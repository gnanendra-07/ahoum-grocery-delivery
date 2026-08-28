import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Smartphone } from 'lucide-react';
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
      setError('Please enter a valid mobile number.');
      return;
    }
    setError(null);
    setTempPhone(`${countryCode} ${phoneNumber}`);
    navigate('/auth/verify');
  };

  return (
    <div className="w-full h-full min-h-[896px] bg-white text-gray-900 flex flex-col justify-between p-6 relative">
      {/* Top Bar with Back Chevron */}
      <div>
        <button
          onClick={() => navigate('/auth')}
          className="p-2 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] mb-6"
          aria-label="Go back"
          type="button"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-gray-900">Enter your mobile number</h1>
          <p className="text-xs text-gray-500 font-medium">
            Mobile Number
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 my-auto">
        <div className="space-y-2">
          <div className="flex items-center gap-3 border-b-2 border-gray-200 focus-within:border-[#53B175] pb-2 transition-colors">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              aria-label="Country code"
              className="bg-transparent text-sm font-bold text-gray-900 focus:outline-none"
            >
              <option value="+1">🇺🇸 +1</option>
              <option value="+91">🇮🇳 +91</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+61">🇦🇺 +61</option>
            </select>

            <div className="relative flex-1 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="(555) 019-2834"
                className="w-full bg-transparent text-base font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-normal focus:outline-none"
                autoFocus
                required
              />
            </div>
          </div>
          {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
        </div>

        {/* Floating Right Arrow Action Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="w-14 h-14 bg-[#53B175] hover:bg-[#489d67] text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
            aria-label="Continue to OTP verification"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="pb-4 text-center text-xs text-gray-400">
        <p>By continuing you agree to receive SMS codes.</p>
      </div>
    </div>
  );
};
