import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, Search, AlertTriangle, ShieldCheck, User as UserIcon, LogOut } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { useAuthStore } from '../stores/useAuthStore';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const totalItems = useCartStore((state) => state.getTotalItemsCount());
  const { user, isAuthenticated, activeAddress, isSimulatingFailures, toggleSimulateFailures, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
      {/* Simulation Banner */}
      {isSimulatingFailures && (
        <div className="bg-amber-500 text-white text-[11px] font-semibold px-3 py-1 flex items-center justify-between">
          <span className="flex items-center gap-1 truncate">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            API Failure Enabled (30%)
          </span>
          <button
            onClick={toggleSimulateFailures}
            className="underline hover:text-amber-100 text-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded ml-2"
            type="button"
          >
            Disable
          </button>
        </div>
      )}

      <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
        {/* Left: Brand & Address Chip */}
        <div className="flex items-center gap-2 min-w-0">
          <Link
            to="/"
            className="flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-0.5 flex-shrink-0"
          >
            <span className="text-xl font-black bg-gradient-to-r from-[#53B175] to-emerald-600 bg-clip-text text-transparent">
              Ahoum
            </span>
          </Link>

          {/* Location Chip */}
          <button
            onClick={() => navigate('/auth/location')}
            className="flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded-xl border border-gray-200/60 truncate transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
            title="Change Delivery Location"
            type="button"
          >
            <MapPin className="w-3 h-3 text-[#53B175] flex-shrink-0" />
            <span className="font-semibold text-gray-800 truncate">
              {activeAddress ? activeAddress.street : 'Select Location'}
            </span>
          </button>
        </div>

        {/* Right: Quick Search, Dev Toggle, User Auth & Cart */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Quick Search */}
          <button
            onClick={() => navigate('/search')}
            className="p-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
            aria-label="Search products"
            type="button"
          >
            <Search className="w-4 h-4 text-gray-500" />
          </button>

          {/* User Profile / Auth Toggle */}
          {isAuthenticated && user ? (
            <button
              onClick={() => {
                logout();
                navigate('/welcome');
              }}
              title={`Logged in as ${user.name}. Click to log out.`}
              className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              type="button"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <Link
              to="/welcome"
              className="p-1.5 bg-gray-50 hover:bg-brand-50 text-gray-600 hover:text-[#53B175] border border-gray-200 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
              title="Sign In"
            >
              <UserIcon className="w-4 h-4" />
            </Link>
          )}

          {/* Dev Failure Toggle */}
          <button
            onClick={toggleSimulateFailures}
            title={isSimulatingFailures ? 'Disable Network Failures' : 'Enable Network Failures'}
            className={`p-1.5 rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
              isSimulatingFailures
                ? 'bg-amber-50 text-amber-600 border-amber-200'
                : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-gray-600'
            }`}
            type="button"
            aria-label={isSimulatingFailures ? 'Disable Network Failures' : 'Enable Network Failures'}
          >
            {isSimulatingFailures ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
          </button>

          {/* Cart Icon Link */}
          <Link
            to="/cart"
            className="relative flex items-center justify-center p-1.5 bg-[#53B175] hover:bg-[#489d67] text-white rounded-xl shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
            aria-label={`Shopping cart with ${totalItems} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-extrabold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center border-2 border-white">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};
