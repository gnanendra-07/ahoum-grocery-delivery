import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Category, Product } from '../types';
import { mockApi } from '../services/mockApi';
import { ProductCard } from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonLoader';
import { ErrorMessage } from '../components/ErrorMessage';

// ─── Hero Banner data ────────────────────────────────────────────────────────

const heroBanners = [
  {
    id: 1,
    badge: 'LIMITED DEAL',
    headline: 'Fresh Vegetables',
    sub: 'Farm-to-table freshness, delivered same day.',
    discount: 'Get Up To 40% OFF',
    ctaLabel: 'Shop Vegetables',
    ctaTo: '/category/vegetables',
    imageUrl:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80',
    overlayFrom: 'from-emerald-950/85',
    overlayVia: 'via-emerald-900/60',
  },
  {
    id: 2,
    badge: 'DAILY FRESH',
    headline: 'Seasonal Fruits',
    sub: 'Hand-picked seasonal varieties every morning.',
    discount: 'Up To 30% Savings',
    ctaLabel: 'Shop Fruits',
    ctaTo: '/category/fresh-fruits',
    imageUrl:
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1400&q=80',
    overlayFrom: 'from-orange-950/80',
    overlayVia: 'via-orange-900/55',
  },
  {
    id: 3,
    badge: 'NEW ARRIVAL',
    headline: 'Artisan Bakery',
    sub: 'Freshly baked bread and pastries, every day.',
    discount: 'From Only $1.99',
    ctaLabel: 'Shop Bakery',
    ctaTo: '/category/bakery-bread',
    imageUrl:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=80',
    overlayFrom: 'from-amber-950/80',
    overlayVia: 'via-amber-900/50',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CATEGORY_PALETTE = [
  { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-900', dot: 'bg-orange-400' },
  { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-900', dot: 'bg-emerald-500' },
  { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-900', dot: 'bg-blue-400' },
  { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-900', dot: 'bg-amber-400' },
  { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-900', dot: 'bg-purple-400' },
  { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-900', dot: 'bg-rose-400' },
  { bg: 'bg-teal-50', border: 'border-teal-100', text: 'text-teal-900', dot: 'bg-teal-400' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  to: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, to }) => (
  <div className="flex items-center justify-between mb-3 lg:mb-5">
    <h2 className="text-base font-bold text-gray-900 lg:text-2xl lg:font-extrabold">{title}</h2>
    <Link
      to={to}
      className="flex items-center gap-1 text-xs lg:text-sm font-semibold text-[#53B175] hover:text-[#489d67] transition-colors group"
    >
      See all
      <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 group-hover:translate-x-0.5 transition-transform" />
    </Link>
  </div>
);

// ─── Hero Carousel ────────────────────────────────────────────────────────────

const HeroBanner: React.FC = () => {
  const [active, setActive] = useState(0);

  const prev = useCallback(
    () => setActive((i) => (i === 0 ? heroBanners.length - 1 : i - 1)),
    []
  );
  const next = useCallback(
    () => setActive((i) => (i === heroBanners.length - 1 ? 0 : i + 1)),
    []
  );

  // Auto-advance every 5 s on desktop
  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  // heroBanners is a non-empty const array; active is always a valid index via modulo
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const banner = heroBanners[active]!;

  return (
    // Mobile: compact banner (h-32), Desktop: large cinematic banner (h-[420px])
    <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-md lg:shadow-xl h-32 lg:h-[420px] flex items-center">
      {/* Background image */}
      <img
        key={banner.id}
        src={banner.imageUrl}
        alt={banner.headline}
        className="absolute inset-0 w-full h-full object-cover animate-fade-in"
        loading="eager"
      />

      {/* Overlay gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${banner.overlayFrom} ${banner.overlayVia} to-transparent`}
      />

      {/* Content */}
      <div className="relative z-10 text-white px-5 lg:px-14 max-w-[220px] lg:max-w-[520px]">
        {/* Badge */}
        <span className="hidden lg:inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          {banner.badge}
        </span>

        <h1 className="text-lg lg:text-5xl font-black leading-tight drop-shadow-sm lg:leading-none">
          {banner.headline}
        </h1>

        <p className="hidden lg:block text-sm text-white/80 font-medium mt-3 leading-relaxed">
          {banner.sub}
        </p>

        <p className="text-[11px] lg:text-xl text-emerald-300 lg:text-emerald-200 font-bold mt-0.5 lg:mt-4">
          {banner.discount}
        </p>

        {/* Desktop CTA */}
        <Link
          to={banner.ctaTo}
          className="hidden lg:inline-flex items-center gap-2 mt-6 bg-[#53B175] hover:bg-[#489d67] text-white text-sm font-bold px-6 py-3 rounded-2xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
        >
          {banner.ctaLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Desktop: prev / next arrows */}
      <button
        onClick={prev}
        className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 text-white items-center justify-center transition-all"
        aria-label="Previous banner"
        type="button"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 text-white items-center justify-center transition-all"
        aria-label="Next banner"
        type="button"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Desktop: dot indicators */}
      <div className="hidden lg:flex absolute bottom-5 left-1/2 -translate-x-1/2 gap-2">
        {heroBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to banner ${i + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
};

// ─── Category Strip ───────────────────────────────────────────────────────────

interface CategoryStripProps {
  categories: Category[];
}

const CategoryStrip: React.FC<CategoryStripProps> = ({ categories }) => (
  <div className="flex gap-3 lg:gap-4 overflow-x-auto pb-2 lg:pb-0 scrollbar-none lg:grid lg:grid-cols-7">
    {categories.map((cat, idx) => {
      // CATEGORY_PALETTE is non-empty and idx % length is always a valid index
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const palette = CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length]!;
      return (
        <Link
          key={cat.id}
          to={`/category/${cat.slug}`}
          className={`flex items-center gap-2.5 lg:flex-col lg:gap-2 lg:justify-center px-3.5 py-2.5 lg:px-3 lg:py-4 rounded-2xl border ${palette.bg} ${palette.border} ${palette.text} min-w-[140px] lg:min-w-0 flex-shrink-0 lg:flex-shrink hover:shadow-md transition-all group`}
        >
          <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="lg:text-center">
            <span className="text-xs lg:text-[11px] font-bold line-clamp-1 lg:leading-snug">
              {cat.name}
            </span>
            <p className="hidden lg:block text-[10px] font-medium opacity-60 mt-0.5">
              {cat.productCount} items
            </p>
          </div>
        </Link>
      );
    })}
  </div>
);

// ─── Product Section ──────────────────────────────────────────────────────────

interface ProductSectionProps {
  title: string;
  to: string;
  products: Product[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  skeletonCount?: number;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  to,
  products,
  loading,
  error,
  onRetry,
  skeletonCount = 4,
}) => (
  <section>
    <SectionHeader title={title} to={to} />
    {loading ? (
      <SkeletonGrid count={skeletonCount} />
    ) : error ? (
      <ErrorMessage title="Failed to load items" message={error} onRetry={onRetry} />
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 lg:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    )}
  </section>
);

// ─── HomePage ─────────────────────────────────────────────────────────────────

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [catRes, prodRes] = await Promise.all([
        mockApi.getCategories(),
        mockApi.getProducts({ limit: 20 }),
      ]);

      setCategories(catRes.data);
      setProducts(prodRes.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while fetching home data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter products for Figma sections
  // Mobile: 2 cards. Desktop: up to 8.
  const exclusiveOffers = products
    .filter((p) => p.discountPrice !== undefined && p.discountPrice < p.price)
    .slice(0, 8);
  const bestSelling = products.filter((p) => p.isPopular).slice(0, 8);
  const groceriesProducts = products.slice(2, 10);

  return (
    <div className="space-y-5 lg:space-y-10 pb-4 lg:pb-10">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Exclusive Offer */}
      <ProductSection
        title="Exclusive Offer"
        to="/category/fresh-fruits"
        products={exclusiveOffers}
        loading={loading}
        error={error}
        onRetry={fetchData}
        skeletonCount={4}
      />

      {/* 3. Best Selling */}
      <ProductSection
        title="Best Selling"
        to="/category/fresh-fruits"
        products={bestSelling}
        loading={loading}
        error={error}
        onRetry={fetchData}
        skeletonCount={4}
      />

      {/* 4. Groceries */}
      <section>
        <SectionHeader title="Groceries" to="/category/fresh-fruits" />

        {/* Category Strip */}
        <div className="mb-4 lg:mb-6">
          <CategoryStrip categories={categories} />
        </div>

        {/* Groceries Products */}
        {loading ? (
          <SkeletonGrid count={4} />
        ) : error ? (
          <ErrorMessage title="Failed to load items" message={error} onRetry={fetchData} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 lg:gap-5">
            {groceriesProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
