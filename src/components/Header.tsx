import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, Search, AlertTriangle, ShieldCheck, Heart, Home, LayoutGrid } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { useFavoritesStore } from '../stores/useFavoritesStore';
import { useAuthStore } from '../stores/useAuthStore';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const totalItems = useCartStore((state) => state.getTotalItemsCount());
  const favoriteCount = useFavoritesStore((state) => state.favoriteIds.length);
  const { activeAddress, isSimulatingFailures, toggleSimulateFailures } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
      {/* Simulation Banner */}
      {isSimulatingFailures && (
        <div className="bg-amber-500 text-white text-xs font-semibold px-4 py-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5 max-w-7xl mx-auto w-full">
            <AlertTriangle className="w-3.5 h-3.5" />
            API Failure Simulation Enabled (30% random error rate)
          </span>
          <button
            onClick={toggleSimulateFailures}
            className="underline hover:text-amber-100 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            type="button"
          >
            Disable
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Brand & Address */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-0.5"
          >
            <span className="text-2xl font-black bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
              Ahoum
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-100 text-brand-800 rounded-full uppercase tracking-wider">
              10 Min
            </span>
          </Link>
          
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200/60 max-w-[240px] truncate">
            <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
            <span className="font-medium text-gray-700 truncate">
              {activeAddress ? `${activeAddress.label} • ${activeAddress.street}` : 'Select Location'}
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Desktop navigation">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`
            }
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/category/fresh-fruits"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`
            }
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Categories</span>
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`
            }
          >
            <Heart className="w-4 h-4" />
            <span>Saved</span>
            {favoriteCount > 0 && (
              <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                {favoriteCount}
              </span>
            )}
          </NavLink>
        </nav>

        {/* Right: Search Bar & Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Search trigger button / bar */}
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-500 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="Search products"
            type="button"
          >
            <Search className="w-4 h-4 text-gray-400" />
            <span className="hidden sm:inline text-gray-400">Search groceries...</span>
          </button>

          {/* Dev Failure Toggle Button */}
          <button
            onClick={toggleSimulateFailures}
            title={isSimulatingFailures ? 'Disable Network Failures' : 'Enable Network Failures'}
            className={`p-2 rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
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
            className="relative flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label={`Shopping cart with ${totalItems} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="bg-white text-brand-700 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};
