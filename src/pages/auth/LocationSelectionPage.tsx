import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const LocationSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setActiveAddress, setCustomLocation } = useAuthStore();

  const [zone, setZone] = useState<string>('Springfield, Oregon');
  const [area, setArea] = useState<string>('742 Evergreen Terrace');
  const [customStreet, setCustomStreet] = useState<string>('');

  const handleConfirm = () => {
    if (customStreet.trim()) {
      setCustomLocation('Home', customStreet.trim(), 'Springfield', '97477');
    } else if (user?.addresses[0]) {
      setActiveAddress(user.addresses[0].id);
    } else {
      setCustomLocation('Home', '742 Evergreen Terrace', 'Springfield', '97477');
    }
    navigate('/');
  };

  return (
    <div className="w-full h-full min-h-[896px] bg-white text-gray-900 flex flex-col justify-between p-6 relative">
      {/* Top Map Illustration Banner */}
      <div className="pt-6 text-center space-y-4">
        <div className="w-36 h-36 bg-gradient-to-br from-emerald-50 to-brand-50 rounded-full mx-auto flex items-center justify-center border-4 border-emerald-100/50 shadow-inner relative">
          <Navigation className="w-16 h-16 text-[#53B175] animate-pulse" />
          <div className="w-6 h-6 bg-[#53B175] rounded-full absolute bottom-4 right-4 flex items-center justify-center text-white shadow">
            <MapPin className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-gray-900">Select Your Location</h1>
          <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
            Switch on your location to stay in tune with what’s happening in your area
          </p>
        </div>
      </div>

      {/* Selectors Stack */}
      <div className="space-y-4 my-auto">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 block">Your Zone</label>
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            aria-label="Select delivery zone"
            className="w-full p-3.5 bg-gray-50 border-b-2 border-gray-200 text-sm font-bold text-gray-900 rounded-xl focus:border-[#53B175] focus:outline-none"
          >
            <option value="Springfield, Oregon">Springfield, Oregon</option>
            <option value="Eugene, Oregon">Eugene, Oregon</option>
            <option value="Portland, Oregon">Portland, Oregon</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 block">Your Area / Address</label>
          <select
            value={area}
            onChange={(e) => {
              setArea(e.target.value);
              if (e.target.value !== 'custom') setCustomStreet('');
            }}
            aria-label="Select delivery area"
            className="w-full p-3.5 bg-gray-50 border-b-2 border-gray-200 text-sm font-bold text-gray-900 rounded-xl focus:border-[#53B175] focus:outline-none"
          >
            <option value="742 Evergreen Terrace">742 Evergreen Terrace (Home)</option>
            <option value="100 Innovation Way">100 Innovation Way (Work)</option>
            <option value="custom">+ Add Custom Street Address</option>
          </select>
        </div>

        {area === 'custom' && (
          <input
            type="text"
            placeholder="Enter custom street address..."
            value={customStreet}
            onChange={(e) => setCustomStreet(e.target.value)}
            className="w-full p-3 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
            autoFocus
          />
        )}
      </div>

      {/* Confirm Button */}
      <div className="pb-4">
        <button
          onClick={handleConfirm}
          className="w-full py-4 bg-[#53B175] hover:bg-[#489d67] text-white text-base font-extrabold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
          type="button"
        >
          <span>Submit & Start Shopping</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
