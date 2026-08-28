export interface NutritionalInfo {
  calories?: number; // in kcal
  protein?: string;  // e.g. "1.2g"
  carbs?: string;    // e.g. "14g"
  fat?: string;      // e.g. "0.2g"
  fiber?: string;    // e.g. "2.4g"
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  unit: string;
  stock: number;
  rating: number;
  reviewCount: number;
  categoryId: string;
  categoryName: string;
  images: string[];
  tags: string[];
  isOrganic?: boolean;
  isPopular?: boolean;
  nutritionalInfo?: NutritionalInfo;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  apartment?: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  activeAddressId: string | null;
  isOnboarded: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  error?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type ProductSortOption = 'popular' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export interface ProductFilterParams {
  categoryId?: string;
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isOrganic?: boolean;
  sortBy?: ProductSortOption;
  page?: number;
  limit?: number;
}

export type PaymentMethod = 'upi' | 'card' | 'cod';

export interface CheckoutPayload {
  items: CartItem[];
  addressId: string;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  notes?: string;
}

export type OrderStatus = 'placed' | 'packing' | 'out_for_delivery' | 'delivered' | 'failed';

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
}
