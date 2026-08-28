import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Truck, ShieldCheck, ChevronRight, Check } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

interface OnboardingSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  badge: string;
  colorClass: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Browse 1000+ Fresh Items',
    subtitle: 'Everything You Need Daily',
    description: 'Explore organic fruits, crisp vegetables, dairy, bakery items, and household essentials at your fingertips.',
    icon: ShoppingBag,
    badge: 'Wide Selection',
    colorClass: 'from-emerald-500 to-brand-600',
  },
  {
    id: 2,
    title: '10-Minute Lightning Delivery',
    subtitle: 'Ultra Fast Doorstep Arrival',
    description: 'Our hyper-local dark stores ensure your orders are packed with care and delivered in just 10 minutes.',
    icon: Truck,
    badge: 'Express Shipping',
    colorClass: 'from-brand-600 to-indigo-600',
  },
  {
    id: 3,
    title: 'Quality Farm-to-Table Guarantee',
    subtitle: '100% Fresh & Organic',
    description: 'We source directly from trusted local farmers and suppliers to guarantee peak freshness every time.',
    icon: ShieldCheck,
    badge: 'Quality Promise',
    colorClass: 'from-amber-500 to-brand-600',
  },
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);

  const activeSlide: OnboardingSlide = slides[currentStep] ?? slides[0]!;

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      completeOnboarding();
      navigate('/auth');
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    navigate('/auth');
  };

  const IconComponent = activeSlide.icon;

  return (
    <div className="max-w-md mx-auto min-h-screen sm:min-h-[80vh] flex flex-col justify-between p-6 bg-white sm:rounded-3xl border border-gray-100 shadow-md relative overflow-hidden">
      {/* Header Skip button */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-8 bg-brand-600' : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleSkip}
          className="text-xs font-bold text-gray-400 hover:text-gray-700 px-3 py-1 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          type="button"
        >
          Skip
        </button>
      </div>

      {/* Main Slide Illustration Card */}
      <div className="my-auto py-6 space-y-6 text-center z-10">
        <div className={`w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br ${activeSlide.colorClass} text-white flex items-center justify-center shadow-xl transform transition-transform duration-500 hover:scale-105`}>
          <IconComponent className="w-14 h-14" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/50">
            {activeSlide.badge}
          </span>
          <h2 className="text-2xl font-black text-gray-900 pt-2 leading-tight">
            {activeSlide.title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
            {activeSlide.description}
          </p>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="space-y-3 z-10 pt-4 border-t border-gray-100">
        <button
          onClick={handleNext}
          className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          type="button"
        >
          {currentStep === slides.length - 1 ? (
            <>
              <span>Get Started</span>
              <Check className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
