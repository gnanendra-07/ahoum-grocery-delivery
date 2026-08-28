# Design Notes — Ahoum Grocery Delivery Application

This document outlines the mobile-to-desktop adaptation decisions, responsive UI strategy, design system alignment, and architectural trade-offs applied across the Ahoum Grocery Delivery application.

---

## 1. Mobile-to-Desktop Adaptation Decisions

### Decision 1: Centered Mobile Frame vs Responsive Desktop Container Shell
- **Mobile Treatment:** The application renders within a pixel-matched 414 × 896 mobile device frame (`DeviceFrameWrapper.tsx`) for all authentication, onboarding, and mobile preview flows.
- **Desktop Adaptation:** For main grocery browsing routes (`HomePage`, `ExplorePage`, `CategoryPage`, `ProductDetailPage`, `CartPage`, `CheckoutPage`), the container shell in `MainLayout.tsx` expands fluidly to `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Reasoning:** Locking a desktop website into a narrow mobile box creates excessive empty whitespace on widescreen monitors (1080p, 1440p). By allowing main grocery pages to stretch responsively while preserving the 414 × 896 phone canvas wrapper for mobile auth preview, desktop users enjoy full widescreen productivity while mobile users get a pixel-exact native app experience.
- **Trade-offs:** Requires dual layout abstractions (`MainLayout` for responsive web vs `AuthLayout` for fixed phone frame canvas) and distinct CSS breakpoint styling (`sm:`, `md:`, `lg:`).

---

### Decision 2: Mobile Bottom Navigation Bar vs Desktop Header Navigation Tabs
- **Mobile Treatment:** Fixed bottom navigation bar (`BottomNav.tsx`) with 5 thumb-friendly tabs (Shop, Explore, Cart, Favorites, Account) and dynamic badges.
- **Desktop Adaptation:** On viewports >= 768px (`md:` breakpoint), `BottomNav` is hidden using Tailwind `md:hidden`. Instead, `Header.tsx` renders top navigation links (`hidden md:flex`) with active indicators, live cart item count badges, and saved favorites badges.
- **Reasoning:** Bottom navigation bars are ergonomically optimal for mobile thumbs but feel misplaced on desktop screens where user sight and cursor focus sit near the top of the browser.
- **Trade-offs:** Header and BottomNav must subscribe to the same Zustand cart and favorites state selectors to ensure live badge counts remain perfectly in sync across viewport resizes.

---

### Decision 3: Responsive Product Grid Column Scaling
- **Mobile Treatment:** 2-column compact product grid (`grid-cols-2 gap-2.5`) to optimize vertical space on 414px mobile viewports.
- **Desktop Adaptation:** Utility-first grid scaling applied across `HomePage`, `ExplorePage`, `CategoryPage`, `SearchPage`, and `FavoritesPage`:
  `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6`.
- **Reasoning:** Displaying only 2 columns on desktop monitors leaves massive empty horizontal whitespace. Scaling up to 4–5 columns allows users to scan 15–20 grocery products simultaneously without excessive scrolling.
- **Trade-offs:** Image aspect ratios and card typography must adjust dynamically (`compact={true}` prop on mobile grids vs full card styling on desktop) to prevent visual crowding.

---

### Decision 4: Split 2-Column Layouts for Cart, Checkout & Product Detail
- **Mobile Treatment:** Single-column vertical scroll stack where action buttons (e.g. Checkout button, Pay button, Add to Cart) appear at the bottom.
- **Desktop Adaptation:** 2-column grid layout (`md:grid md:grid-cols-3 md:gap-8`):
  - **Cart Page:** Left column (2 cols) displays item list; right column (1 col) displays a sticky bill breakdown summary box & checkout trigger button.
  - **Checkout Page:** Left column (2 cols) displays delivery address & payment option cards; right column (1 col) displays sticky order summary breakdown.
  - **Product Detail Page:** Left column (1 col) displays hero product image gallery; right column (2 cols) displays product details, stock badges, quantity counter, and Add to Basket action.
- **Reasoning:** Utilizes horizontal desktop real estate effectively and keeps purchase summary & primary action buttons visible above the fold without requiring long vertical scrolls.
- **Trade-offs:** Requires flex and grid order adjustments to ensure DOM elements maintain a logical tab order for keyboard and screen reader accessibility across breakpoints.

---

## 2. Design System & Aesthetics

- **Color Palette:** Curated HSL colors featuring primary Nectar/Ahoum Green (`#53B175`), secondary Dark Charcoal (`#181725`), accent Orange (`#F37A20`), and subtle warm grays (`#F2F3F2`).
- **Typography:** System font stack with bold weights (`font-bold`, `font-extrabold`) for clear visual hierarchy matching Figma specifications.
- **Micro-Animations:** Hover scale effects (`hover:scale-105`), active button press feedback (`active:scale-95`), and pulse animation skeleton loaders during asynchronous data fetching.
