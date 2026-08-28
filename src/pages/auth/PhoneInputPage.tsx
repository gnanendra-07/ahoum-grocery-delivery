import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Wifi, Signal, Battery } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

const FlagIcon: React.FC = () => (
  <div className="w-6 h-4 rounded-sm overflow-hidden flex items-center justify-center bg-[#006A4E] relative flex-shrink-0 shadow-sm border border-gray-200">
    <div className="w-2.5 h-2.5 bg-[#F42A41] rounded-full" />
  </div>
);

export const PhoneInputPage: React.FC = () => {
  const navigate = useNavigate();
  const setTempPhone = useAuthStore((state) => state.setTempPhone);

  const [countryCode, setCountryCode] = useState<string>('+880');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 6) {
      setError('Please enter a valid mobile number.');
      return;
    }
    setError(null);
    setTempPhone(`${countryCode} ${phoneNumber}`);
    navigate('/verification');
  };

  return (
    <div className="bg-white h-full flex flex-col justify-between py-3 px-6 select-none relative overflow-hidden text-gray-900">
      <div className="w-full max-w-[364px] mx-auto flex-1 flex flex-col">
        {/* 1. Status Bar */}
        <div className="flex items-center justify-between text-xs font-semibold text-gray-900 pt-1">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-gray-800">
            <Signal className="w-3.5 h-3.5 fill-gray-800" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-gray-800" />
          </div>
        </div>

        {/* 2. Header Row with Back Chevron */}
        <div className="pt-2">
          <button
            onClick={() => navigate('/auth')}
            className="p-1 -ml-1 text-gray-900 hover:text-gray-600 transition-colors focus-visible:outline-none"
            aria-label="Go back"
            type="button"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        {/* 3. Main Heading & Input Row */}
        <div className="space-y-6 pt-2">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
            Enter your mobile number
          </h1>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-gray-400 block">
              Mobile Number
            </label>

            {/* Input Row */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 focus-within:border-[#53B175] pb-2 transition-colors">
                <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer">
                  <FlagIcon />
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    aria-label="Country code"
                    className="bg-transparent text-sm font-bold text-gray-900 focus:outline-none cursor-pointer"
                  >
                    <option value="+880">+880</option>
                    <option value="+1">+1</option>
                    <option value="+91">+91</option>
                    <option value="+44">+44</option>
                  </select>
                </div>

                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={phoneNumber}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, '');
                    setPhoneNumber(digitsOnly);
                    if (error) setError(null);
                  }}
                  placeholder="Mobile Number"
                  className="w-full bg-transparent text-sm font-semibold text-gray-900 placeholder:text-gray-300 placeholder:font-normal focus:outline-none"
                  autoFocus
                  required
                />
              </div>

              {error && <p className="text-xs text-red-600 font-medium pt-1">{error}</p>}
            </form>
          </div>
        </div>

        {/* 4. Lower-Middle 67x67px Circular Green Continue Button (Right Aligned, Keyboard Aware) */}
        <div className="flex justify-end pt-12 pr-1">
          <button
            onClick={handleSubmit}
            className="w-[67px] h-[67px] bg-[#53B175] hover:bg-[#489d67] active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg transition-all focus-visible:outline-none"
            aria-label="Continue"
            type="button"
          >
            <ChevronRight className="w-8 h-8 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* 5. Bottom iOS Home Indicator */}
      <div className="w-full max-w-[364px] mx-auto pb-1 flex justify-center z-10">
        <div className="w-32 h-1 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
};
