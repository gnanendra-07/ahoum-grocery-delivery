import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Category } from '../types';
import { mockApi } from '../services/mockApi';
import { ErrorMessage } from '../components/ErrorMessage';
import { Search } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await mockApi.getCategories();
      setCategories(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load categories. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  // Figma Nectar Category Card background & border color palette
  const cardStyles = [
    'bg-[#53B175]/10 border-[#53B175]/30', // Fresh Fruits / Veg - Light Green
    'bg-orange-500/10 border-orange-500/30', // Cooking Oil - Light Orange
    'bg-red-500/10 border-red-500/30', // Meat & Fish - Light Red
    'bg-purple-500/10 border-purple-500/30', // Bakery & Snacks - Light Purple
    'bg-amber-500/10 border-amber-500/30', // Dairy & Eggs - Light Yellow
    'bg-blue-500/10 border-blue-500/30', // Beverages - Light Blue
    'bg-teal-500/10 border-teal-500/30', // Additional category
  ];

  return (
    <div className="space-y-4 pb-28">
      {/* 1. Heading: Find Products */}
      <h1 className="text-lg font-bold text-center text-gray-900 pt-1">
        Find Products
      </h1>

      {/* 2. Search Store Input Bar */}
      <div
        onClick={() => navigate('/search')}
        className="flex items-center bg-gray-100 hover:bg-gray-150 rounded-2xl px-4 py-3 cursor-pointer text-gray-400 text-xs font-medium transition-colors border border-transparent"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/search')}
        aria-label="Search store"
      >
        <Search className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
        <span className="text-gray-400 font-medium">Search Store</span>
      </div>

      {/* 3. 2-Column Category Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3.5 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-gray-100 border border-gray-200" />
          ))}
        </div>
      ) : error ? (
        <ErrorMessage
          title="Failed to load categories"
          message={error}
          onRetry={fetchCats}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3.5">
          {categories.map((cat, idx) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const style = cardStyles[idx % cardStyles.length]!;
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={`rounded-2xl border ${style} p-4 flex flex-col items-center justify-between text-center h-44 hover:shadow-sm transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-1`}
              >
                <div className="w-24 h-24 flex items-center justify-center overflow-hidden my-auto">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-xs font-bold text-gray-900 leading-snug">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
