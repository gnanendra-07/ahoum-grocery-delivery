# Ahoum — Mobile-First & Responsive Grocery Delivery App (Phase 5 Complete)

A mobile-first, desktop-adapted grocery delivery web application foundation built with **React**, **TypeScript (Strict Mode)**, **Vite**, **Tailwind CSS**, **Zustand**, and **React Router**.

---

## Technical Stack

- **Core Framework:** React 18 + Vite
- **Language:** TypeScript 5 (Strict Mode enabled, zero `any` types)
- **Styling:** Tailwind CSS (utility-first, responsive breakpoints `sm:`, `md:`, `lg:`, `xl:`)
- **State Management:** Zustand (Cart with auto-revalidation, Favorites, Auth stores)
- **Routing:** React Router v6
- **Data & API:** Asynchronous Mock API Service with AbortSignal support, simulated network latency (200ms–1200ms), and configurable request failure toggles.

---

## Responsive Desktop Adaptation (Phase 5)

- **Responsive Container Shell (`max-w-7xl`):** Expands fluidly from mobile widths up to 1280px+ desktop viewports (`MainLayout.tsx`).
- **Desktop Top Navigation Header (`Header.tsx`):** Displays inline desktop navigation tabs (Home, Categories, Saved, Search, Cart with badges) on `md:` breakpoints, while hiding bottom navigation (`md:hidden`).
- **Grid Scaling:** Product grids adapt from 2 columns on mobile to `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6` on tablet and desktop.
- **Desktop 2-Column Layouts:**
  - **Product Detail:** Left column image gallery, right column info & sticky order action bar.
  - **Cart Summary:** Left column (2 cols) item list, right column (1 col) sticky bill summary.
  - **Checkout Page:** Left column (2 cols) address & payment cards, right column (1 col) sticky order breakdown and pay button.
- **Zero Horizontal Overflow:** Enforced `overflow-x-hidden` across `html, body`.

---

## Development & Build Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```

### 3. Run TypeScript Checks (Zero Errors Requirement)
```bash
npm run typecheck
```

### 4. Build Production Bundle
```bash
npm run build
```
