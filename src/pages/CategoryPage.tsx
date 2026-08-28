import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Category, Product, ProductSortOption } from '../types';
import { mockApi } from '../services/mockApi';
import { ProductCard } from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonLoader';
import { ErrorMessage } from '../components/ErrorMessage';
import { ArrowLeft, SlidersHorizontal, PackageX, Wifi, Signal, Battery } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [sortBy] = useState<ProductSortOption>('popular');
  const [isOrganicOnly] = useState<boolean>(false);

  const fetchCategoryData = async () => {
    setLoading(true);
    setError(null);

    try {
      const targetSlug = slug || 'beverages';
      const catRes = await mockApi.getCategoryBySlug(targetSlug);
      setCurrentCategory(catRes.data);

      const prodRes = await mockApi.getProducts({
        categorySlug: targetSlug,
        sortBy,
        isOrganic: isOrganicOnly ? true : undefined,
      });

      setProducts(prodRes.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch category products.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [slug, sortBy, isOrganicOnly]);

  const categoryName = currentCategory ? currentCategory.name : 'Beverages';

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

      {/* 2. Category Header: Back arrow | Beverages | Filter icon */}
      <div className="flex items-center justify-between pt-0.5 pb-1">
        <button
          onClick={() => navigate(-1)}
          className="p-1 text-gray-800 hover:text-gray-900 transition-colors focus-visible:outline-none"
          aria-label="Go back"
          type="button"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base font-bold text-gray-900 text-center">
          {categoryName}
        </h1>

        <button
          onClick={() => navigate('/filters')}
          className="p-1 transition-colors focus-visible:outline-none text-gray-800 hover:text-gray-900"
          aria-label="Open filters"
          type="button"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* 3. 2-Column Compact Product Grid (All 3 Rows Fit) */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchCategoryData} />
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 my-4">
          <PackageX className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <h3 className="text-xs font-bold text-gray-800">No products found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} compact={true} />
          ))}
        </div>
      )}
    </div>
  );
};
