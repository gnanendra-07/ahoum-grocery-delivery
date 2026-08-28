import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MapPin, Search, ShoppingCart, Heart, User, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useCartStore } from '../stores/useCartStore';
import { useFavoritesStore } from '../stores/useFavoritesStore';

export const DesktopHeader: React.FC = () => {
  const navigate = useNavigate();
  const { activeAddress } = useAuthStore();
  const totalCartItems = useCartStore((state) => state.getTotalItemsCount());
  const favoriteCount = useFavoritesStore((state) => state.favoriteIds.length);

  const locationLabel = activeAddress
    ? `${activeAddress.label}, ${activeAddress.city}`
    : 'Springfield, Home';

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6 xl:px-10 h-[72px] flex items-center gap-4">

        {/* ── Logo ── */}
        <NavLink
          to="/home"
          className="flex items-center gap-2 flex-shrink-0 group"
          aria-label="Ahoum home"
        >
          <span className="w-9 h-9 rounded-xl bg-[#53B175] flex items-center justify-center shadow-sm group-hover:bg-[#489d67] transition-colors">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </span>
          <span className="text-xl font-black text-gray-900 tracking-tight leading-none">
            Ahoum
          </span>
        </NavLink>

        {/* ── Location selector ── */}
        <button
          onClick={() => navigate('/auth/location')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:border-[#53B175]/60 hover:bg-emerald-50 transition-all text-sm text-gray-700 flex-shrink-0 group"
          type="button"
          aria-label="Change delivery location"
        >
          <MapPin className="w-4 h-4 text-[#53B175] flex-shrink-0" />
          <span className="font-medium max-w-[140px] truncate">{locationLabel}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#53B175] transition-colors" />
        </button>

        {/* ── Search bar (grows) ── */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate('/search')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/search')}
          className="flex-1 min-w-0 flex items-center gap-3 px-4 py-2.5 bg-gray-100 hover:bg-gray-200/70 rounded-2xl border border-transparent hover:border-gray-200 cursor-pointer transition-all group"
          aria-label="Search for products"
        >
          <Search className="w-4.5 h-4.5 text-gray-400 group-hover:text-[#53B175] transition-colors flex-shrink-0 w-[18px] h-[18px]" />
          <span className="text-gray-400 text-sm font-medium">Search for groceries, vegetables, fruits…</span>
        </div>

        {/* ── Nav links ── */}
        <nav className="hidden xl:flex items-center gap-1 flex-shrink-0" aria-label="Primary navigation">
          {[
            { to: '/home', label: 'Shop' },
            { to: '/explore', label: 'Explore' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-[#53B175] bg-emerald-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ── Action icons ── */}
        <div className="flex items-center gap-1 flex-shrink-0 ml-1">
          {/* Favourites */}
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `relative flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                isActive ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
              }`
            }
            aria-label="Favourites"
          >
            <Heart className="w-5 h-5" />
            {favoriteCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-sm">
                {favoriteCount}
              </span>
            )}
          </NavLink>

          {/* Cart */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                isActive ? 'text-[#53B175] bg-emerald-50' : 'text-gray-500 hover:text-[#53B175] hover:bg-emerald-50'
              }`
            }
            aria-label="Shopping cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#53B175] text-white text-[9px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-sm">
                {totalCartItems}
              </span>
            )}
          </NavLink>

          {/* Account */}
          <button
            onClick={() => navigate('/auth/location')}
            className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
            type="button"
            aria-label="Account settings"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
