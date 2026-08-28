import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Category, Product, ProductSortOption } from '../types';
import { mockApi } from '../services/mockApi';
import { ProductCard } from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonLoader';
import { ErrorMessage } from '../components/ErrorMessage';
import { SlidersHorizontal, Leaf, PackageX } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [sortBy, setSortBy] = useState<ProductSortOption>('popular');
  const [isOrganicOnly, setIsOrganicOnly] = useState<boolean>(false);

  const fetchCategoryData = async () => {
    setLoading(true);
    setError(null);

    try {
      const catListRes = await mockApi.getCategories();
      setCategories(catListRes.data);

      const targetSlug = slug || 'fresh-fruits';
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

  return (
    <div className="space-y-6">
      {/* Category Navigation Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = cat.slug === (slug || 'fresh-fruits');
          return (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Category Header */}
      {currentCategory && (
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-brand-50 flex-shrink-0">
            <img
              src={currentCategory.image}
              alt={currentCategory.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{currentCategory.name}</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{currentCategory.description}</p>
          </div>
        </div>
      )}

      {/* Filters & Sorting Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
        <button
          onClick={() => setIsOrganicOnly(!isOrganicOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
            isOrganicOnly
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
          type="button"
        >
          <Leaf className="w-3.5 h-3.5" />
          <span>Organic Only</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <span className="hidden sm:inline font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as ProductSortOption)}
            className="bg-gray-50 border border-gray-200 text-gray-800 text-xs font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="popular">Popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Product List Content */}
      {loading ? (
        <SkeletonGrid count={5} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchCategoryData} />
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 my-4">
          <PackageX className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-gray-800">No products found</h3>
          <p className="text-xs text-gray-500 mt-1">
            Try resetting your filters or select a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
