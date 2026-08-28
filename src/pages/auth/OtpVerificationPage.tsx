import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const OtpVerificationPage: React.FC = () => {
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
    const char = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);
    if (error) setError(null);

    // Auto focus next input
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
      setError('Please enter all 4 digits of the verification code.');
      return;
    }

    const success = verifyOtpAndLogin(fullOtp);
    if (success) {
      navigate('/auth/location');
    } else {
      setError('Invalid verification code. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen sm:min-h-[80vh] flex flex-col justify-between p-6 bg-white sm:rounded-3xl border border-gray-100 shadow-md space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/auth/phone')}
          className="p-2.5 bg-gray-50 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 mb-4"
          aria-label="Go back to phone input"
          type="button"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
            Step 2 of 3
          </span>
          <h1 className="text-2xl font-black text-gray-900 pt-1">4-Digit Verification</h1>
          <p className="text-xs text-gray-500">
            Enter the 4-digit code sent to{' '}
            <span className="font-bold text-gray-900">{tempPhone || '+1 (555) 019-2834'}</span>
          </p>
        </div>
      </div>

      {/* 4 Digit Boxes Form */}
      <form onSubmit={handleVerify} className="space-y-6 my-auto">
        <div className="flex justify-center gap-3">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={inputRefs[idx]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-14 h-16 text-center text-2xl font-black bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-brand-600 focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-all shadow-sm"
              autoFocus={idx === 0}
              aria-label={`Digit ${idx + 1} of verification code`}
            />
          ))}
        </div>

        {error && <p className="text-xs text-red-600 font-semibold text-center">{error}</p>}

        <button
          type="submit"
          className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <span>Verify & Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Resend Timer & Demo Hint */}
      <div className="text-center space-y-2 border-t border-gray-100 pt-4">
        {resendTimer > 0 ? (
          <p className="text-xs text-gray-400 font-medium">
            Resend code in <span className="font-bold text-brand-600">{resendTimer}s</span>
          </p>
        ) : (
          <button
            onClick={() => setResendTimer(30)}
            className="text-xs font-bold text-brand-600 hover:underline inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
            type="button"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Resend Verification Code
          </button>
        )}

        <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-800 font-medium flex items-center justify-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span>Mock Verification: Enter any 4 digits (e.g. 1234)</span>
        </div>
      </div>
    </div>
  );
};
