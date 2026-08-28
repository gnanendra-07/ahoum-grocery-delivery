import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check, Wifi, Signal, Battery } from 'lucide-react';

export const FilterPage: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<{ [key: string]: boolean }>({
    'Eggs': true,
    'Noodles & Pasta': false,
    'Chips & Crisps': false,
    'Fast Food': false,
  });

  const [brands, setBrands] = useState<{ [key: string]: boolean }>({
    'Individual Collection': false,
    'Cocola': true,
    'Ifad': false,
    'Kazi Farms': false,
  });

  const toggleCategory = (name: string) => {
    setCategories((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleBrand = (name: string) => {
    setBrands((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleApply = () => {
    navigate(-1);
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
        </div>

        {/* 3. Categories Section */}
        <div className="pt-2">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Categories</h2>
          <div className="space-y-3">
            {Object.keys(categories).map((catName) => {
              const isChecked = categories[catName];
              return (
                <div
                  key={catName}
                  onClick={() => toggleCategory(catName)}
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
                    {catName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Brand Section */}
        <div className="pt-2">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Brand</h2>
          <div className="space-y-3">
            {Object.keys(brands).map((brandName) => {
              const isChecked = brands[brandName];
              return (
                <div
                  key={brandName}
                  onClick={() => toggleBrand(brandName)}
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
                    {brandName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Apply Filter Button */}
      <div className="pt-4 pb-3 max-w-[364px] mx-auto w-full">
        <button
          onClick={handleApply}
          className="w-full bg-[#53B175] hover:bg-[#489d67] text-white text-sm font-bold py-3.5 px-4 rounded-2xl shadow-sm transition-all focus-visible:outline-none active:scale-[0.99]"
          type="button"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
};
