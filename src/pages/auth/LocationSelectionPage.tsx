import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Navigation, Wifi, Signal, Battery } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const LocationSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setActiveAddress, setCustomLocation } = useAuthStore();

  const [zone, setZone] = useState<string>('Banasree');
  const [area, setArea] = useState<string>('Block A');
  const [customStreet, setCustomStreet] = useState<string>('');

  const handleConfirm = () => {
    if (customStreet.trim()) {
      setCustomLocation('Home', customStreet.trim(), zone, '1219');
    } else if (user?.addresses[0]) {
      setActiveAddress(user.addresses[0].id);
    } else {
      setCustomLocation('Home', `${area}, ${zone}`, zone, '1219');
    }
    // After submitting location selection, navigate to LoginPage
    navigate('/login');
  };

  return (
    <div className="bg-white h-full flex flex-col justify-between py-3 px-6 select-none relative overflow-hidden text-gray-900">
      <div className="space-y-4 w-full max-w-[364px] mx-auto flex-1 flex flex-col">
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
        <div className="pt-1">
          <button
            onClick={() => navigate('/verification')}
            className="p-1 -ml-1 text-gray-900 hover:text-gray-600 transition-colors focus-visible:outline-none"
            aria-label="Go back"
            type="button"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        {/* 3. Map Illustration & Heading */}
        <div className="pt-2 text-center space-y-4">
          <div className="w-36 h-36 bg-emerald-50 rounded-full mx-auto flex items-center justify-center border-4 border-emerald-100/50 shadow-inner relative">
            <Navigation className="w-16 h-16 text-[#53B175]" />
            <div className="w-6 h-6 bg-[#53B175] rounded-full absolute bottom-4 right-4 flex items-center justify-center text-white shadow">
              <MapPin className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Select Your Location
            </h1>
            <p className="text-xs font-semibold text-gray-400 max-w-xs mx-auto leading-relaxed">
              Switch on your location to stay in tune with what's happening in your area
            </p>
          </div>
        </div>

        {/* 4. Selectors Stack */}
        <div className="space-y-4 pt-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 block">
              Your Zone
            </label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              aria-label="Select delivery zone"
              className="w-full bg-transparent text-sm font-semibold text-gray-900 border-b border-gray-200 focus-within:border-[#53B175] pb-2 focus:outline-none cursor-pointer"
            >
              <option value="Banasree">Banasree</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Gulshan">Gulshan</option>
              <option value="Dhanmondi">Dhanmondi</option>
            </select>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-gray-400 block">
              Your Area
            </label>
            <select
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                if (e.target.value !== 'custom') setCustomStreet('');
              }}
              aria-label="Select delivery area"
              className="w-full bg-transparent text-sm font-semibold text-gray-900 border-b border-gray-200 focus-within:border-[#53B175] pb-2 focus:outline-none cursor-pointer"
            >
              <option value="Block A">Types of your area</option>
              <option value="Block A">Block A</option>
              <option value="Block B">Block B</option>
              <option value="Block C">Block C</option>
              <option value="custom">+ Add Custom Address</option>
            </select>
          </div>

          {area === 'custom' && (
            <input
              type="text"
              placeholder="Enter custom street address..."
              value={customStreet}
              onChange={(e) => setCustomStreet(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-gray-900 border-b border-gray-200 focus:border-[#53B175] pb-2 focus:outline-none"
              autoFocus
            />
          )}

          {/* Submit Button */}
          <div className="pt-6">
            <button
              onClick={handleConfirm}
              className="w-full h-12 bg-[#53B175] hover:bg-[#489d67] active:scale-[0.99] text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center focus-visible:outline-none"
              type="button"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* 5. Bottom iOS Home Indicator */}
      <div className="w-full max-w-[364px] mx-auto pb-1 flex justify-center z-10">
        <div className="w-32 h-1 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
};
