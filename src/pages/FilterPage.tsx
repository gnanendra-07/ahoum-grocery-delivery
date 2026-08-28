import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Check, Wifi, Signal, Battery } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { Category } from '../types';

// Filter state that can be passed via navigation
export interface FilterState {
  selectedCategories: string[]; // category slugs
  isOrganicOnly: boolean;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'rating';
}

const SORT_OPTIONS: { label: string; value: FilterState['sortBy'] }[] = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
];

export const FilterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read any pre-existing filter state passed from the calling page
  const existingFilters = (location.state as { filters?: FilterState } | null)?.filters;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState<boolean>(true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    existingFilters?.selectedCategories ?? []
  );
  const [isOrganicOnly, setIsOrganicOnly] = useState<boolean>(
    existingFilters?.isOrganicOnly ?? false
  );
  const [sortBy, setSortBy] = useState<FilterState['sortBy']>(
    existingFilters?.sortBy ?? 'popular'
  );

  useEffect(() => {
    const load = async () => {
      try {
        const res = await mockApi.getCategories();
        setCategories(res.data);
      } catch {
        // Silently fall back to empty; filter still works for organic & sort
      } finally {
        setLoadingCats(false);
      }
    };
    load();
  }, []);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleApply = () => {
    // Navigate back to the calling page.
    // Filter state (selectedCategories, isOrganicOnly, sortBy) is stored locally;
    // full URL-param integration with CategoryPage is a future enhancement.
    navigate(-1);
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setIsOrganicOnly(false);
    setSortBy('popular');
  };


  return (
    <div className="bg-white min-h-full flex flex-col justify-between py-3 px-6">
      <div className="space-y-4 max-w-[364px] mx-auto w-full">
        {/* 1. Status Bar / Top Safe Area */}
        <div className="flex items-center justify-between text-xs font-semibold text-gray-900 pt-1">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-gray-800">
            <Signal className="w-3.5 h-3.5 fill-gray-800" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-gray-800" />
          </div>
        </div>

        {/* 2. Header */}
        <div className="flex items-center justify-between pt-1 pb-2 border-b border-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="p-1 text-gray-800 hover:text-gray-900 transition-colors focus-visible:outline-none"
            aria-label="Close filters"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>

          <h1 className="text-base font-bold text-gray-900 text-center flex-1 pr-6">
            Filters
          </h1>

          <button
            onClick={handleReset}
            className="text-[10px] font-semibold text-[#53B175] hover:text-[#489d67] transition-colors focus-visible:outline-none"
            type="button"
          >
            Reset
          </button>
        </div>

        {/* 3. Sort Section */}
        <div className="pt-1">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Sort By</h2>
          <div className="space-y-3">
            {SORT_OPTIONS.map(({ label, value }) => (
              <div
                key={value}
                onClick={() => setSortBy(value)}
                className="flex items-center gap-3 cursor-pointer group py-0.5"
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    sortBy === value
                      ? 'bg-[#53B175] border-[#53B175]'
                      : 'bg-white border-gray-300 group-hover:border-gray-400'
                  }`}
                >
                  {sortBy === value && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span
                  className={`text-xs font-medium ${
                    sortBy === value ? 'text-[#53B175] font-semibold' : 'text-gray-700'
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Organic Filter */}
        <div className="pt-1">
          <div
            onClick={() => setIsOrganicOnly((prev) => !prev)}
            className="flex items-center gap-3 cursor-pointer group py-0.5"
          >
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                isOrganicOnly
                  ? 'bg-[#53B175] border-[#53B175] text-white'
                  : 'bg-white border-gray-300 group-hover:border-gray-400'
              }`}
            >
              {isOrganicOnly && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span
              className={`text-xs font-medium ${
                isOrganicOnly ? 'text-[#53B175] font-semibold' : 'text-gray-700'
              }`}
            >
              Organic Products Only
            </span>
          </div>
        </div>

        {/* 5. Categories Section (real data from API) */}
        <div className="pt-1">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Categories</h2>
          {loadingCats ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-5 bg-gray-100 rounded-md w-48" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((cat) => {
                const isChecked = selectedCategories.includes(cat.slug);
                return (
                  <div
                    key={cat.id}
                    onClick={() => toggleCategory(cat.slug)}
                    className="flex items-center gap-3 cursor-pointer group py-0.5"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'bg-[#53B175] border-[#53B175] text-white'
                          : 'bg-white border-gray-300 group-hover:border-gray-400'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isChecked ? 'text-[#53B175] font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {cat.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 6. Apply Filter Button */}
      <div className="pt-4 pb-3 max-w-[364px] mx-auto w-full">
        <button
          onClick={handleApply}
          className="w-full bg-[#53B175] hover:bg-[#489d67] text-white text-sm font-bold py-3.5 px-4 rounded-2xl shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2 active:scale-[0.99]"
          type="button"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
};
