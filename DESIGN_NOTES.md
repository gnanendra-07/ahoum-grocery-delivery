# Design Notes — Ahoum Mobile-First Grocery Delivery App

## Architecture & Foundational Principles

### 1. Responsive & Mobile-First Strategy
- **Mobile Viewports (< 768px):** Centered `max-w-md` mobile frame, thumb-friendly fixed bottom navigation (`BottomNav.tsx`), compact header, and 2-column product grids.
- **Desktop Viewports (>= 768px):** Fluid container expanding up to `max-w-7xl`, desktop top navigation bar (`Header.tsx`), 4 to 5 column product grids, 2-column Product Detail layout, and 2-column Cart & Checkout views with sticky summary sidebars.

### 2. Async Resilience & Race Condition Shielding
- **AbortController Integration:** `mockApi.searchProducts` and `mockApi.getProducts` accept optional `AbortSignal` parameters.
- **Request Generation Tracking:** `SearchPage.tsx` maintains request generation counters to discard stale out-of-order promise resolutions.
- **Automated Audit Suite:** Integrated test panel in Search page to verify race condition shielding in real time.

### 3. Persisted Cart Integrity & Stock Guarding
- **Initial Sanitization:** `loadCartFromStorage()` screens corrupt JSON structures and invalid schema objects.
- **App Mount Revalidation:** `App.tsx` triggers `revalidateCart()` on startup, syncing prices, clamping quantities against live product stock, and dropping discontinued items.
- **Inventory Safeguards:** UI disables quantity increments when `quantity >= stock` and displays sold out badges for 0-stock products.

### 4. UX State Coverage & Accessibility
- **Skeleton Loaders:** `SkeletonProductCard`, `SkeletonGrid`, and `SkeletonProductDetail` provide pulse animation skeletons for loading states across all data views.
- **Keyboard Navigation:** High-contrast focus rings (`focus-visible:ring-2 focus-visible:ring-brand-500`) applied across all interactive elements.
