import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RefreshCw, CheckCircle2 } from 'lucide-react';
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
      navigate('/auth/location');
    } else {
      setError('Invalid verification code.');
    }
  };

  return (
    <div className="w-full h-full min-h-[896px] bg-white text-gray-900 flex flex-col justify-between p-6 relative">
      {/* Top Bar with Back Chevron */}
      <div>
        <button
          onClick={() => navigate('/auth/phone')}
          className="p-2 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] mb-6"
          aria-label="Go back to mobile number input"
          type="button"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-gray-900">Enter your 4-digit code</h1>
          <p className="text-xs text-gray-500 font-medium">
            Code sent to <span className="font-bold text-gray-900">{tempPhone || '+1 (555) 019-2834'}</span>
          </p>
        </div>
      </div>

      {/* Code Input Boxes */}
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
              className="w-14 h-16 text-center text-2xl font-black bg-gray-50 border-b-2 border-gray-300 focus:border-[#53B175] focus:bg-white focus:outline-none transition-all"
              autoFocus={idx === 0}
              aria-label={`Digit ${idx + 1}`}
            />
          ))}
        </div>

        {error && <p className="text-xs text-red-600 font-semibold text-center">{error}</p>}

        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => setResendTimer(30)}
            disabled={resendTimer > 0}
            className="text-xs font-bold text-[#53B175] hover:underline disabled:opacity-50 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] rounded"
            type="button"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
          </button>

          <button
            type="submit"
            className="w-14 h-14 bg-[#53B175] hover:bg-[#489d67] text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
            aria-label="Submit verification code"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      </form>

      {/* Mock Info */}
      <div className="pb-4 text-center">
        <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-800 font-medium inline-flex items-center justify-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span>Enter any 4 digits (e.g. 1234)</span>
        </div>
      </div>
    </div>
  );
};
