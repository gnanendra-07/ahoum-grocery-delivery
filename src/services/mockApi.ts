import { Category, Product, ProductFilterParams, ApiResponse } from '../types';
import { mockCategories } from '../data/categories';
import { mockProducts } from '../data/products';

export interface MockApiOptions {
  minLatencyMs?: number;
  maxLatencyMs?: number;
  failureRate?: number;
}

class MockApiService {
  private minLatencyMs = 200;
  private maxLatencyMs = 1200;
  private failureRate = 0;
  private simulateFailures = false;

  public configure(options: MockApiOptions): void {
    if (options.minLatencyMs !== undefined) this.minLatencyMs = options.minLatencyMs;
    if (options.maxLatencyMs !== undefined) this.maxLatencyMs = options.maxLatencyMs;
    if (options.failureRate !== undefined) this.failureRate = options.failureRate;
  }

  public setSimulateFailures(enable: boolean, failureRate = 0.2): void {
    this.simulateFailures = enable;
    this.failureRate = failureRate;
  }

  public isSimulatingFailures(): boolean {
    return this.simulateFailures;
  }

  private async simulateNetwork(signal?: AbortSignal, customDelayMs?: number): Promise<void> {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const latency =
      customDelayMs !== undefined
        ? customDelayMs
        : Math.floor(Math.random() * (this.maxLatencyMs - this.minLatencyMs + 1)) +
          this.minLatencyMs;

    await new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (signal?.aborted) {
          reject(new DOMException('Aborted', 'AbortError'));
        } else {
          resolve();
        }
      }, latency);

      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timeoutId);
          reject(new DOMException('Aborted', 'AbortError'));
        });
      }
    });

    if (this.simulateFailures && Math.random() < this.failureRate) {
      throw new Error('Simulated network error (503 Service Unavailable). Please retry.');
    }
  }

  /**
   * Fetch all categories
   */
  public async getCategories(signal?: AbortSignal): Promise<ApiResponse<Category[]>> {
    await this.simulateNetwork(signal);
    return {
      data: mockCategories,
      status: 200,
      message: 'Categories fetched successfully',
    };
  }

  /**
   * Fetch a single category by slug
   */
  public async getCategoryBySlug(slug: string, signal?: AbortSignal): Promise<ApiResponse<Category | null>> {
    await this.simulateNetwork(signal);
    const category = mockCategories.find((c) => c.slug === slug) || null;
    return {
      data: category,
      status: category ? 200 : 404,
      message: category ? 'Category found' : 'Category not found',
    };
  }

  /**
   * Fetch products with optional filtering, search, sorting and pagination
   */
  public async getProducts(
    params: ProductFilterParams = {},
    signal?: AbortSignal,
    customDelayMs?: number
  ): Promise<ApiResponse<Product[]>> {
    await this.simulateNetwork(signal, customDelayMs);

    let filtered = [...mockProducts];

    // Category ID filter
    if (params.categoryId) {
      filtered = filtered.filter((p) => p.categoryId === params.categoryId);
    }

    // Category Slug filter
    if (params.categorySlug) {
      const cat = mockCategories.find((c) => c.slug === params.categorySlug);
      if (cat) {
        filtered = filtered.filter((p) => p.categoryId === cat.id);
      } else {
        filtered = [];
      }
    }

    // Search filter
    if (params.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Organic filter
    if (params.isOrganic !== undefined) {
      filtered = filtered.filter((p) => p.isOrganic === params.isOrganic);
    }

    // Price range filter
    if (params.minPrice !== undefined) {
      filtered = filtered.filter((p) => (p.discountPrice ?? p.price) >= (params.minPrice ?? 0));
    }
    if (params.maxPrice !== undefined) {
      filtered = filtered.filter((p) => (p.discountPrice ?? p.price) <= (params.maxPrice ?? Infinity));
    }

    // Sorting
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
          break;
        case 'price-desc':
          filtered.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'popular':
          filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
          break;
        case 'newest':
          filtered.sort((a, b) => b.id.localeCompare(a.id));
          break;
      }
    }

    // Pagination
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 20;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);

    const paginatedData = filtered.slice((page - 1) * limit, page * limit);

    return {
      data: paginatedData,
      status: 200,
      message: 'Products fetched successfully',
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Fetch product by ID
   */
  public async getProductById(id: string, signal?: AbortSignal): Promise<ApiResponse<Product | null>> {
    await this.simulateNetwork(signal);
    const product = mockProducts.find((p) => p.id === id) || null;
    return {
      data: product,
      status: product ? 200 : 404,
      message: product ? 'Product found' : 'Product not found',
    };
  }

  /**
   * Fetch product by slug
   */
  public async getProductBySlug(slug: string, signal?: AbortSignal): Promise<ApiResponse<Product | null>> {
    await this.simulateNetwork(signal);
    const product = mockProducts.find((p) => p.slug === slug) || null;
    return {
      data: product,
      status: product ? 200 : 404,
      message: product ? 'Product found' : 'Product not found',
    };
  }

  /**
   * Quick search products with optional AbortSignal and optional custom delay
   */
  public async searchProducts(
    query: string,
    signal?: AbortSignal,
    customDelayMs?: number
  ): Promise<ApiResponse<Product[]>> {
    return this.getProducts({ search: query, limit: 10 }, signal, customDelayMs);
  }
}

export const mockApi = new MockApiService();
