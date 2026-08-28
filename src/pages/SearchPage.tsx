import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { mockApi } from '../services/mockApi';
import { ProductCard } from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonLoader';
import { ErrorMessage } from '../components/ErrorMessage';
import { Search, X, SlidersHorizontal, Wifi, Signal, Battery } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>('Egg');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const latestRequestIdRef = useRef<number>(0);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const currentRequestId = ++latestRequestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const res = await mockApi.searchProducts(searchTerm, controller.signal);
      if (currentRequestId !== latestRequestIdRef.current) return;
      setResults(res.data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      if (currentRequestId === latestRequestIdRef.current) {
        setError('Failed to perform search.');
      }
    } finally {
      if (currentRequestId === latestRequestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    performSearch(query);
  }, [query]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="space-y-2.5 pb-20">
      {/* 1. Status Bar / Top Safe Area */}
      <div className="flex items-center justify-between text-xs font-semibold text-gray-900 pt-1 px-1">
        <span>9:41</span>
        <div className="flex items-center gap-1.5 text-gray-800">
          <Signal className="w-3.5 h-3.5 fill-gray-800" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4 fill-gray-800" />
        </div>
      </div>

      {/* 2. Search Bar Header */}
      <div className="flex items-center gap-2 pt-0.5 pb-1">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Store"
            className="w-full pl-9 pr-8 py-2.5 bg-gray-100/90 rounded-2xl text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus-visible:outline-none border border-transparent"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
              aria-label="Clear search"
              type="button"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => navigate('/filters')}
          className="p-2 text-gray-800 hover:text-gray-900 transition-colors focus-visible:outline-none flex-shrink-0"
          aria-label="Search filters"
          type="button"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* 3. 2-Column Product Grid (All 3 Rows Fit) */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => performSearch(query)} />
      ) : results.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 my-4">
          <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <h3 className="text-xs font-bold text-gray-800">No results found for "{query}"</h3>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} compact={true} />
          ))}
        </div>
      )}
    </div>
  );
};
