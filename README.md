# Ahoum — Mobile-First & Responsive Grocery Delivery Web Application

A production-grade, mobile-first grocery delivery web application built with **React 18**, **TypeScript (Strict Mode)**, **Vite**, **Tailwind CSS**, **Zustand**, and **React Router v6**.

Designed to match Figma specifications pixel-closely for mobile viewports while scaling responsively up to widescreen desktop displays (`1280px+`).

---

## 1. Key Features & Accomplishments

### Full Authentication & Onboarding Sequence
1. **Splash Screen (`/`)**: Solid Nectar green `#53B175` background, top iOS status bar (`9:41`), centered white logo mark at 40% vertical height, and 1.8s auto-transition.
2. **Onboarding Screen (`/onboarding`)**: Hero grocery image carousel, headline, and "Get Started" CTA.
3. **Sign In Landing Screen (`/signin` / `/auth`)**: Top grocery produce hero image, `"Get your groceries with nectar"` title, Bangladesh `+880` phone selector row, and Google / Facebook social sign-in buttons.
4. **Mobile Number Input (`/auth/phone`)**: Native numeric keypad support (`type="tel"`, `inputMode="numeric"`, `pattern="[0-9]*"`), `+880` country code selector, digit filtering, and 67 × 67 px green circular continue arrow button (`#53B175`).
5. **Verification / 4-Digit OTP (`/verification`)**: 4-digit numeric code input with auto-focus advance, backspace handling, countdown resend timer (`30s`), and 67 × 67 px green circular continue button.
6. **Select Location Screen (`/auth/location`)**: Map location pin illustration, delivery zone selector (`Banasree`, `Dhaka`, `Gulshan`, `Dhanmondi`), area selector (`Block A`, `Block B`, `Block C`, custom address), and "Submit" button.
7. **Log In Screen (`/login`)**: Email input, password field with eye icon toggle, "Forgot Password?" link, green "Log In" button, and link to Sign Up.
8. **Sign Up Screen (`/signup`)**: Username input, email input with green check validation indicator, password with eye toggle, terms notice, green "Sign Up" button, and link to Log In.

### Main Grocery Store Experience
- **Home View (`/home`)**: Search header, location pill selector, promotional banner slider, Exclusive Offer carousel, Best Selling products, Category chips, and Groceries section.
- **Explore Categories (`/explore`)**: Grid of 6 distinct category tiles (Fresh Fruits & Vegetables, Cooking Oil & Ghee, Meat & Fish, Bakery & Snacks, Dairy & Eggs, Beverages).
- **Category Filter View (`/category/:slug`)**: Product grid filtered by category with price sorting, organic filter toggle, skeleton loaders, and empty state handling.
- **Search Experience (`/search`)**: Real-time async search with AbortController cancellation and request sequence validation preventing out-of-order response race conditions.
- **Product Detail (`/product/:id`)**: High-res product image gallery, title, unit price, stock indicator badge, expandable nutrition/details accordions, quantity counter, and Add to Basket CTA.
- **Favorites (`/favorites`)**: Saved items list with one-tap Add to Cart and item removal.
- **Cart & Checkout (`/cart`, `/checkout`)**: Persistent cart with automatic price sync, stock clamping, tax calculation, address selection, payment option picker, and Order Accepted (`/order-accepted`) / Order Failed (`/order-failed`) status screens.

---

## 2. Technical Stack

- **Core:** React 18 + Vite
- **Language:** TypeScript 5.5 (Strict Mode enabled, zero `any` types)
- **Styling:** Tailwind CSS 3.4 (utility-first, custom design tokens, responsive breakpoints `sm:`, `md:`, `lg:`, `xl:`)
- **Icons:** Lucide React
- **State Management:** Zustand 4.5 (Cart store with `localStorage` persistence and catalog revalidation, Favorites store, Auth store)
- **Routing:** React Router v6 (layout routes `MainLayout` & `AuthLayout`)
- **Testing:** Node.js native test runner (`npm test`)

---

## 3. Installation & Setup Instructions

### 1. Clone Repository & Install Dependencies
```bash
git clone <repository-url>
cd ahoum
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Automated Test Suite
```bash
npm test
```
Executes automated unit tests for search race protection and cart persistence revalidation.

### 4. Run TypeScript Compilation Check
```bash
npm run typecheck
```
Ensures 100% strict compilation with zero errors.

### 5. Build Production Bundle
```bash
npm run build
```
Generates optimized production bundle in `dist/`.

---

## 4. Architecture & State Management Summary

```
src/
├── components/          # Reusable UI components (Header, BottomNav, ProductCard, SkeletonLoader, DeviceFrameWrapper)
├── data/                # Mock catalog datasets (categories.ts, products.ts)
├── layouts/             # Layout boundaries (MainLayout for app, AuthLayout for phone canvas)
├── pages/               # Screen components (HomePage, SearchPage, CartPage, Auth screens)
├── services/            # Mock API service with AbortSignal support & latency simulation (mockApi.ts)
├── stores/              # Zustand state stores (useCartStore.ts, useFavoritesStore.ts, useAuthStore.ts)
├── tests/               # Automated unit test suite (standalone.test.ts)
├── types/               # TypeScript interfaces & domain models (index.ts)
└── routes/              # Centralized route definitions (AppRoutes.tsx)
```

- **Cart Revalidation Policy:** `useCartStore.ts` loads persisted cart items from `localStorage`. On application mount, `revalidateCart()` syncs stored items against the catalog:
  - Products no longer in catalog or with `stock === 0` are automatically removed.
  - Prices and metadata are updated to match current catalog rates.
  - Quantities exceeding stock are clamped to `product.stock`.
- **Search Shielding Policy:** `SearchPage.tsx` uses `AbortController` cancellation and an incremental `latestRequestIdRef` sequence counter to reject delayed out-of-order promise resolutions.

---

## 5. Documentation Map

- [`DESIGN_NOTES.md`](file:///c:/Users/gnana/Desktop/ahoum/DESIGN_NOTES.md): Mobile-to-desktop adaptation decisions, responsive grid strategies, and UI trade-offs.
- [`DECISIONS.md`](file:///c:/Users/gnana/Desktop/ahoum/DECISIONS.md): Engineering decisions, persisted cart revalidation matrix, and search race protection design.
- [`DEBUGGING.md`](file:///c:/Users/gnana/Desktop/ahoum/DEBUGGING.md): Real issues encountered (route collisions, layout shifts, logo misalignments) and verified resolutions.
- [`PROMPT_LOG.md`](file:///c:/Users/gnana/Desktop/ahoum/PROMPT_LOG.md): AI pair programming history, accepted/rejected prompts, and AI correction examples.

---

## 6. Known Limitations & Future Enhancements

- **Backend Integration:** Currently powered by an asynchronous Mock API Service simulating 200–1200ms latency. In production, this can be connected directly to a REST/GraphQL backend API.
- **Payment Processing:** Payment step simulates card/cash selection. Production enhancement would integrate Stripe/PayPal SDKs.
- **What Would Be Improved With Another Day:**
  - Add End-to-End Playwright/Cypress integration test suite for full visual regression testing.
  - Implement full Internationalization (i18n) for multi-language support (English / Bengali).
  - Add dark mode toggle using Tailwind CSS dark variables.
