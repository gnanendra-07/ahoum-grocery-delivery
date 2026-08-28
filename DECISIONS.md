# Technical Decisions — Ahoum Grocery Delivery App

This document records architectural choices and engineering decisions made across project phases.

---

## 1. Responsive Desktop Container Architecture
- **Context:** Previously, the app container was locked to `max-w-md` on all viewports, restricting desktop display.
- **Decision:** Expanded container shell in `MainLayout.tsx` to `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Breakpoints Used:** Pure Tailwind CSS media queries (`sm:`, `md:`, `lg:`, `xl:`). Zero JS window resize listeners were added, preserving declarative rendering performance.

---

## 2. Desktop Navigation & Mobile-First Integrity
- **Context:** Bottom navigation is optimal for mobile thumbs but redundant on desktop.
- **Decision:**
  - Added `md:hidden` to `BottomNav.tsx` to hide bottom navigation on desktop viewports.
  - Added desktop navigation links in `Header.tsx` (`hidden md:flex`) supporting Home, Categories, Saved/Favorites (with badge), Search, and Cart (with badge).

---

## 3. Responsive Product Grid Scaling
- **Context:** 2-column grids on wide desktop viewports leave excessive empty horizontal whitespace.
- **Decision:** Applied responsive grid column utility scaling: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5` across `HomePage`, `CategoryPage`, `FavoritesPage`, `SearchPage`, and `SkeletonGrid`.

---

## 4. Desktop 2-Column Product Detail, Cart & Checkout Layouts
- **Decision:** Utilized 2-column grid layouts on medium/large screens (`md:grid md:grid-cols-3 md:gap-8`):
  - **Product Detail:** Image gallery on left column, details/actions on right column.
  - **Cart Page:** Cart items on left column (2 cols), sticky bill breakdown & checkout trigger on right column (1 col).
  - **Checkout Page:** Delivery address & payment method cards on left column (2 cols), sticky order summary & pay button on right column (1 col).

---

## 5. Search Race-Condition Protection Strategy
- **Context:** Rapid text input in search fields can trigger multiple overlapping asynchronous requests.
- **Decision:** Combined `AbortController` cancellation with a `latestRequestId` counter reference in `SearchPage.tsx` and `MockApiService`. Verified via automated race condition test panel.

---

## 6. Persisted Cart Consistency & Stock Limits
- **Decision:** `loadCartFromStorage` handles malformed JSON without crashing. `revalidateCart` syncs prices, prunes deleted items, clamps quantities to `product.stock`, and purges 0-quantity entries.

---

## 7. Accessibility & Semantics
- **Decision:** Applied explicit `type="button"` attributes to all non-submitting buttons, `focus-visible:ring-2 focus-visible:ring-brand-500` rings for keyboard navigation, and descriptive `aria-label` attributes on icon-only controls.
