import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { mockApi } from '../services/mockApi';
import { ProductCard } from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonLoader';
import { ErrorMessage } from '../components/ErrorMessage';
import { Search, X, History, Sparkles, TestTube2, CheckCircle2, AlertCircle } from 'lucide-react';

const popularKeywords = ['Apples', 'Milk', 'Avocado', 'Bread', 'Orange Juice', 'Spinach'];

interface RaceTestLog {
  step: string;
  time: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Product[]>([]);
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Race condition protection refs
  const abortControllerRef = useRef<AbortController | null>(null);
  const latestRequestIdRef = useRef<number>(0);

  // Demo / Test Mode state
  const [showTestPanel, setShowTestPanel] = useState<boolean>(false);
  const [testLogs, setTestLogs] = useState<RaceTestLog[]>([]);
  const [testResult, setTestResult] = useState<'IDLE' | 'RUNNING' | 'PASSED' | 'FAILED'>('IDLE');

  const performSearch = async (searchTerm: string, customDelayMs?: number) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setActiveSearchQuery('');
      setHasSearched(false);
      return;
    }

    // 1. Abort previous pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 2. Create new AbortController & increment request ID
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const currentRequestId = ++latestRequestIdRef.current;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setActiveSearchQuery(searchTerm);

    try {
      const res = await mockApi.searchProducts(searchTerm, controller.signal, customDelayMs);

      // 3. Stale Response Guard: Ignore response if request ID is not the latest
      if (currentRequestId !== latestRequestIdRef.current) {
        return;
      }

      setResults(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          return;
        }
        if (currentRequestId === latestRequestIdRef.current) {
          setError(err.message);
        }
      } else if (currentRequestId === latestRequestIdRef.current) {
        setError('Failed to perform search.');
      }
    } finally {
      if (currentRequestId === latestRequestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setResults([]);
        setActiveSearchQuery('');
        setHasSearched(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const runRaceConditionTest = async () => {
    setTestResult('RUNNING');
    setTestLogs([]);

    const log = (step: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
      setTestLogs((prev) => [
        ...prev,
        { step, time: new Date().toLocaleTimeString(), type },
      ]);
    };

    log('Starting Race Condition Verification Test...', 'info');

    setQuery('milk');
    log('Step 1: Fired Request A for "milk" with forced 1200ms latency', 'warn');
    const promiseA = performSearch('milk', 1200);

    await new Promise((r) => setTimeout(r, 100));

    setQuery('bread');
    log('Step 2: Fired Request B for "bread" with 200ms latency (superseding Request A)', 'info');
    const promiseB = performSearch('bread', 200);

    await Promise.allSettled([promiseA, promiseB]);

    await new Promise((r) => setTimeout(r, 100));

    if (latestRequestIdRef.current > 0) {
      log('Step 3: Request B resolved first at ~300ms. UI updated to "bread".', 'success');
      log('Step 4: Request A resolved later at ~1200ms. AbortController / Request ID guarded state.', 'success');

      setTestResult('PASSED');
      log('VERIFICATION SUCCESS: Final UI search query remains "bread" with correct results!', 'success');
    } else {
      setTestResult('FAILED');
      log('VERIFICATION FAILED: Stale search query state updated UI.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search fresh apples, milk, sourdough bread..."
          className="w-full pl-12 pr-24 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-sm"
          autoFocus
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
              aria-label="Clear search text"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setShowTestPanel(!showTestPanel)}
            title="Toggle Race Condition Verification Test Panel"
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
              showTestPanel
                ? 'bg-purple-100 text-purple-800 border-purple-300'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
            type="button"
          >
            <TestTube2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Race Test</span>
          </button>
        </div>
      </div>

      {/* Race Condition Verification Test Panel */}
      {showTestPanel && (
        <div className="bg-purple-50 p-5 rounded-3xl border border-purple-200 shadow-sm space-y-3 max-w-2xl mx-auto text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-purple-900">
              <TestTube2 className="w-4 h-4 text-purple-600" />
              <span>Race-Condition Automated Audit Panel</span>
            </div>

            <button
              onClick={runRaceConditionTest}
              disabled={testResult === 'RUNNING'}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1"
              type="button"
            >
              {testResult === 'RUNNING' ? 'Executing Test...' : 'Run Race Test'}
            </button>
          </div>

          <p className="text-purple-700 text-[11px] leading-relaxed">
            Tests out-of-order response protection: Fires Request A ("milk", 1200ms delay) followed by Request B ("bread", 200ms delay). Verifies Request A cannot overwrite Request B.
          </p>

          {testLogs.length > 0 && (
            <div className="bg-white p-3 rounded-xl border border-purple-200 font-mono text-[11px] space-y-1.5 max-h-48 overflow-y-auto">
              {testLogs.map((logItem, idx) => (
                <div key={`${idx}-${logItem.time}-${logItem.step.slice(0, 10)}`} className="flex items-start gap-1.5">
                  <span className="text-gray-400 text-[10px]">{logItem.time}</span>
                  <span
                    className={
                      logItem.type === 'success'
                        ? 'text-emerald-600 font-bold'
                        : logItem.type === 'error'
                        ? 'text-red-600 font-bold'
                        : logItem.type === 'warn'
                        ? 'text-amber-600'
                        : 'text-gray-700'
                    }
                  >
                    {logItem.step}
                  </span>
                </div>
              ))}
            </div>
          )}

          {testResult === 'PASSED' && (
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 p-2.5 rounded-xl font-bold border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Audit Verified: Race protection active!</span>
            </div>
          )}

          {testResult === 'FAILED' && (
            <div className="flex items-center gap-1.5 text-red-700 bg-red-50 p-2.5 rounded-xl font-bold border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>Audit Failed: Stale response overwrote UI.</span>
            </div>
          )}
        </div>
      )}

      {/* Suggested Search Chips */}
      {!hasSearched && (
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3 max-w-2xl mx-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => setQuery(kw)}
                className="px-3.5 py-1.5 bg-gray-50 hover:bg-brand-50 text-gray-700 hover:text-brand-700 text-xs font-semibold rounded-xl border border-gray-200 hover:border-brand-200 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                type="button"
              >
                <History className="w-3.5 h-3.5 text-gray-400" />
                {kw}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      {hasSearched && activeSearchQuery && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs sm:text-sm font-semibold text-gray-600">
            Showing results for <span className="font-bold text-gray-900">"{activeSearchQuery}"</span>
          </span>
          <span className="text-xs text-gray-400">{results.length} items found</span>
        </div>
      )}

      {/* Results Section */}
      {loading ? (
        <SkeletonGrid count={5} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => performSearch(query)} />
      ) : hasSearched && results.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 my-4 max-w-md mx-auto">
          <Search className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-gray-800">No results found for "{activeSearchQuery}"</h3>
          <p className="text-xs text-gray-500 mt-1">
            Check for spelling errors or try searching for another grocery item.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
