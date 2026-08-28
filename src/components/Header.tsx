import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { activeAddress } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100/80 px-4 pt-3 pb-2.5 space-y-2.5 flex-shrink-0">
      {/* Top: Brand Logo & Location */}
      <div className="flex flex-col items-center justify-center">
        {/* Brand Logo / Icon */}
        <div className="flex items-center justify-center gap-1 mb-1">
          <svg className="w-6 h-6 text-[#53B175]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
          </svg>
          <span className="text-xl font-black text-gray-900 tracking-tight">
            Ahoum
          </span>
        </div>

        {/* Location selector */}
        <button
          onClick={() => navigate('/auth/location')}
          className="flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-[#53B175] transition-colors"
          type="button"
        >
          <MapPin className="w-3.5 h-3.5 text-[#53B175] fill-[#53B175]/20 flex-shrink-0" />
          <span>{activeAddress ? `${activeAddress.label}, ${activeAddress.street}` : 'Dhaka, Banani'}</span>
        </button>
      </div>

      {/* Search Store Bar */}
      <div
        onClick={() => navigate('/search')}
        className="flex items-center bg-gray-100/90 hover:bg-gray-150 rounded-2xl px-4 py-2.5 cursor-pointer text-gray-400 text-xs font-medium transition-colors border border-transparent hover:border-gray-200"
      >
        <Search className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
        <span className="text-gray-400 font-medium">Search Store</span>
      </div>
    </header>
  );
};
