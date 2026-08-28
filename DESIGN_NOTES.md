# Design Notes — Ahoum Grocery Delivery Application

This document outlines the mobile-to-desktop adaptation decisions, responsive UI strategy, design system alignment, and architectural trade-offs applied across the Ahoum Grocery Delivery application.

---

## 1. Mobile-to-Desktop Adaptation Decisions

### Decision 1: Phone Frame Canvas vs. Responsive Desktop Shell

- **Mobile Treatment:** All authentication, onboarding, and phone-framed grocery screens render inside a pixel-matched 414 × 896 mobile device frame (`DeviceFrameWrapper.tsx`). This creates an authentic native-app experience within the browser on narrow viewports.
- **Desktop Adaptation (Home page only):** When the viewport is `≥ 1024px` and the current route is `/home`, `MainLayout.tsx` detects this with a `useIsDesktopWide()` hook and renders a full-width shell instead of the phone frame. The shell includes a new `DesktopHeader.tsx` sticky navigation bar and a `max-w-[1400px] mx-auto` page container.
- **Non-home grocery pages (Cart, Category, Product Detail, etc.):** These continue to render inside the phone frame even on desktop, presenting them as a mobile-first preview — consistent with the Figma specification that defines only mobile screen layouts.
- **Reasoning:** The assignment's Figma reference only specifies 414 × 896 mobile layouts. The desktop Home adaptation was added as an enhancement beyond the brief to demonstrate responsive capability. Containing non-home grocery pages within the phone frame avoids speculative responsive layouts that were never designed.
- **Trade-offs:** Requires a dual rendering path in `MainLayout.tsx`. The `html` element gets the `.desktop-home` CSS class on mount to re-enable document-level scrolling that the phone frame normally locks.

---

### Decision 2: Mobile Bottom Navigation vs. Desktop Header Navigation

- **Mobile Treatment:** Fixed bottom navigation bar (`BottomNav.tsx`) with 5 thumb-friendly tabs — Shop, Explore, Cart, Favorites, Account — with live Zustand-driven badge counts.
- **Desktop Treatment (Home page):** A dedicated `DesktopHeader.tsx` component renders a 72px sticky full-width header with: Ahoum logo, location chip, large search bar, Shop/Explore navigation links, Favourites badge icon, Cart badge icon, Account icon.
- **On Non-home pages (phone frame):** `BottomNav` remains visible inside the phone frame on all screen sizes since those pages are always rendered in the phone canvas context.
- **Reasoning:** Desktop users expect top-of-page navigation; a bottom tab bar looks misplaced. The `DesktopHeader` only appears when the page is in full-width desktop mode.
- **Trade-offs:** `DesktopHeader` and `BottomNav` both subscribe to the same Zustand cart and favorites selectors to ensure badge counts stay in sync.

---

### Decision 3: Responsive Product Grid Column Scaling (Home page)

- **Mobile Treatment:** 2-column compact product grid (`grid-cols-2 gap-2.5`) for 414px phone canvas.
- **Desktop Adaptation (Home page):** Grid scaling with `lg:grid-cols-4` for product sections and `lg:grid-cols-7` for the category strip. Hero banner scales from `h-32` (mobile) to `h-[420px]` (desktop) with an auto-advancing 3-slide carousel on desktop.
- **Reasoning:** Full widescreen desktop real estate allows simultaneous scanning of 12–16 grocery products, substantially reducing the need to scroll versus the 2-column mobile layout.
- **Trade-offs:** `ProductCard.tsx` uses additive `lg:` classes for image height, text size, and pricing — all changes are additive and do not affect the mobile rendering path.

---

### Decision 4: Single-Column Layout for Cart, Checkout & Product Detail

- **Mobile Treatment:** All secondary pages use single-column vertical scroll matching the Figma phone mockup exactly.
- **Desktop Treatment:** Currently, Cart, Checkout, and Product Detail render inside the phone frame canvas even on wide viewports (see Decision 1). The assignment Figma only specifies mobile layouts for these pages; a speculative 2-column desktop split was considered but not implemented to stay faithful to the Figma brief.
- **Future Enhancement:** If desktop layouts are ever specified, the recommended approach is a 2-column `md:grid md:grid-cols-3` split: left 2-cols for item list / product image, right 1-col for sticky order summary / product actions.

---

## 2. Design System & Aesthetics

- **Color Palette:** Curated HSL colors — primary Nectar Green (`#53B175`), dark Charcoal (`#181725`), accent Orange (`#F37A20`), warm background gray (`#F2F3F2`).
- **Typography:** `Inter` (Google Fonts) with system-ui fallback. Bold weight hierarchy (`font-bold` → `font-extrabold` → `font-black`) for clear visual priority matching Figma.
- **Micro-Animations:** Hover scale effects (`hover:scale-105`), active press feedback (`active:scale-[0.99]`), pulse skeleton loaders during async fetches, `animate-fade-in` on hero carousel slides.
- **Accessibility:** WCAG 2.1 AA focus indicators applied: all primary CTA buttons have `focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2`. A global `*:focus-visible { outline: 2px solid #53B175 }` rule in `index.css` provides a baseline ring for any element not explicitly styled.
- **Status Bar:** All phone-frame screens show a static `9:41` time display (standard Figma/Apple mock convention). No live clock code exists in the application.
