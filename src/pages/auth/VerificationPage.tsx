import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RefreshCw, Wifi, Signal, Battery } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { tempPhone, verifyOtpAndLogin } = useAuthStore();

  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);
    if (error) setError(null);

    const nextTarget = inputRefs[index + 1];
    if (char && index < 3 && nextTarget && nextTarget.current) {
      nextTarget.current.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const prevTarget = inputRefs[index - 1];
    if (e.key === 'Backspace' && !otp[index] && index > 0 && prevTarget && prevTarget.current) {
      prevTarget.current.focus();
    }
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 4) {
      setError('Please enter all 4 digits of the code.');
      return;
    }

    const success = verifyOtpAndLogin(fullOtp);
    if (success) {
      // Upon successful 4-digit OTP verification, navigate to Select Location screen
      navigate('/auth/location');
    } else {
      setError('Invalid verification code.');
    }
  };

  const handleResendCode = () => {
    setResendTimer(30);
    setOtp(['', '', '', '']);
    setError(null);
    const firstInput = inputRefs[0];
    if (firstInput && firstInput.current) {
      firstInput.current.focus();
    }
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
            onClick={() => navigate('/auth/phone')}
            className="p-1 -ml-1 text-gray-900 hover:text-gray-600 transition-colors focus-visible:outline-none"
            aria-label="Go back to mobile number input"
            type="button"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        {/* 3. Main Heading & Code Label */}
        <div className="space-y-6 pt-2">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
            Enter your 4-digit code
          </h1>

          {tempPhone && (
            <p className="text-xs font-semibold text-gray-400">
              Code sent to <span className="font-bold text-gray-900">{tempPhone}</span>
            </p>
          )}

          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold text-gray-400 block">
              Code
            </label>

            {/* 4-Digit OTP Input Row */}
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="flex justify-start gap-4 pt-1 border-b border-gray-200 focus-within:border-[#53B175] pb-3 transition-colors">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    placeholder="-"
                    className="w-10 h-10 text-center text-xl font-bold bg-transparent text-gray-900 placeholder:text-gray-300 focus:outline-none"
                    autoFocus={idx === 0}
                    aria-label={`Digit ${idx + 1}`}
                  />
                ))}
              </div>

              {error && <p className="text-xs text-red-600 font-medium pt-1">{error}</p>}
            </form>
          </div>

          {/* Resend Code Link */}
          <div className="pt-4">
            <button
              onClick={handleResendCode}
              disabled={resendTimer > 0}
              className="text-xs font-bold text-[#53B175] hover:underline disabled:opacity-50 flex items-center gap-1 focus-visible:outline-none"
              type="button"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
            </button>
          </div>
        </div>

        {/* 4. Lower-Middle 67x67px Circular Green Continue Button (Right Aligned) */}
        <div className="flex justify-end pt-12 pr-1">
          <button
            onClick={handleVerify}
            className="w-[67px] h-[67px] bg-[#53B175] hover:bg-[#489d67] active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg transition-all focus-visible:outline-none"
            aria-label="Submit verification code"
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
