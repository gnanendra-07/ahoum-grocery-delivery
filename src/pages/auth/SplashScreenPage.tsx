import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Signal, Battery } from 'lucide-react';

export const SplashScreenPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 1800);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleNext = () => {
    navigate('/onboarding');
  };

  return (
    <div
      onClick={handleNext}
      className="w-full h-full bg-[#53B175] text-white flex flex-col justify-between items-center px-6 py-3 relative cursor-pointer select-none overflow-hidden"
    >
      {/* 1. Mobile Status Bar (White icons & text for green background) */}
      <div className="w-full flex items-center justify-between text-xs font-semibold text-white pt-1 px-1 z-10">
        <span>9:41</span>
        <div className="flex items-center gap-1.5 text-white">
          <Signal className="w-3.5 h-3.5 fill-white text-white" />
          <Wifi className="w-3.5 h-3.5 text-white" />
          <Battery className="w-4 h-4 fill-white text-white" />
        </div>
      </div>

      {/* 2. Ahoum Logo Group (Positioned at exact 40% vertical region of 896px canvas) */}
      <div className="mt-48 mb-auto z-10 flex items-center justify-center gap-3.5">
        {/* Ahoum All-White Logo Mark SVG */}
        <svg className="w-12 h-14 flex-shrink-0" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M26.5 49.5C26.5 49.5 39 31 38 18.5C37 6 24 9.5 24 9.5C24 9.5 11 6 10 18.5C9 31 21.5 49.5 21.5 49.5C22.5 51 25.5 51 26.5 49.5Z"
            fill="#FFFFFF"
          />
          <path
            d="M21 11C21 11 17 2 9 4C9 4 14 10 20 11.5Z"
            fill="#53B175"
          />
          <path
            d="M24 11C24 11 28 2 36 4C36 4 31 10 25 11.5Z"
            fill="#53B175"
          />
        </svg>

        {/* Ahoum Wordmark & Subtitle */}
        <div className="text-left">
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none">
            Ahoum
          </h1>
          <p className="text-[10px] font-bold text-white/90 tracking-[0.28em] uppercase pt-1">
            online groceries
          </p>
        </div>
      </div>

      {/* 3. Bottom iOS Home Indicator */}
      <div className="w-full pb-2 z-10 flex justify-center">
        <div className="w-32 h-1 bg-white/90 rounded-full" />
      </div>
    </div>
  );
};
