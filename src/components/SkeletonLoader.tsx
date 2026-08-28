import React from 'react';

export const SkeletonProductCard: React.FC = () => {
  return (
    <div
      className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm animate-pulse space-y-3"
      aria-busy="true"
      aria-label="Loading product card"
    >
      <div className="aspect-square w-full rounded-xl bg-gray-200" />
      <div className="space-y-1.5">
        <div className="h-3 w-1/3 bg-gray-200 rounded" />
        <div className="h-4 w-4/5 bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-5 w-1/3 bg-gray-200 rounded" />
        <div className="h-7 w-12 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
};

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 gap-3" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
};

export const SkeletonProductDetail: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse" aria-busy="true" aria-label="Loading product details">
      <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
        <div className="aspect-square w-full rounded-xl bg-gray-200" />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
        <div className="h-4 w-1/4 bg-gray-200 rounded-full" />
        <div className="h-8 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
        <div className="h-10 w-1/2 bg-gray-200 rounded-lg pt-2" />
        <div className="h-20 w-full bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
};
