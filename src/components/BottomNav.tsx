import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, Search, Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { useFavoritesStore } from '../stores/useFavoritesStore';

export const BottomNav: React.FC = () => {
  const totalCartItems = useCartStore((state) => state.getTotalItemsCount());
  const favoriteCount = useFavoritesStore((state) => state.favoriteIds.length);

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/category/fresh-fruits', label: 'Categories', icon: LayoutGrid },
    { to: '/search', label: 'Search', icon: Search },
    { to: '/favorites', label: 'Saved', icon: Heart, badge: favoriteCount },
    { to: '/cart', label: 'Cart', icon: ShoppingBag, badge: totalCartItems },
  ];

  return (
    <nav
      className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 py-1.5 px-2 mt-auto"
      aria-label="Main navigation"
    >
      <div className="w-full flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  isActive
                    ? 'text-[#53B175] font-extrabold'
                    : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#53B175] text-white text-[9px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
