# Prompt Log — Ahoum Grocery Delivery Application

This document records material AI-assisted work performed during project development, prompt summaries, accepted/rejected decisions, and concrete examples of AI corrections.

---

## 1. AI-Assisted Development Log

| Phase / Prompt Goal | Tool / Model | Prompt Summary | Accepted Changes | Rejected / Corrected Changes | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Foundation & Stores** | Antigravity AI | Set up React + Vite + TypeScript project structure, Zustand cart/favorites stores, mock API, and basic routing. | Zustand store definitions, mock product dataset, React Router routes. | Rejected initial un-persisted cart state; required `localStorage` persistence with `loadCartFromStorage()`. | `npm run typecheck` & build |
| **Phase 2: Figma Auth Screens** | Antigravity AI | Implement Splash, Onboarding, Sign In, Mobile Number, Verification, Select Location, Login, and Sign Up screens matching Figma references. | 414 × 896 canvas styling, status bar icons, green circular continue arrow buttons, form inputs. | **Corrected Logo:** AI initially generated an orange carrot icon for Splash; corrected to all-white Nectar/Ahoum logo mark (`#FFFFFF`). | Visual inspection & `npm run build` |
| **Phase 3: Auth Flow Routing** | Antigravity AI | Audit and align complete step-by-step authentication sequence. | Route path registrations (`/signin`, `/auth/phone`, `/verification`, `/auth/location`, `/login`). | **Corrected Redirect:** AI initially bypassed `SignInPage` during onboarding transition; corrected `OnboardingPage` to navigate to `/auth`. | Step-by-step browser walkthrough & `npm test` |
| **Phase 4: Responsive Desktop** | Antigravity AI | Adapt mobile application to desktop viewports without breaking mobile Figma match. | `max-w-7xl` shell in `MainLayout`, desktop header tabs (`Header.tsx`), 4–5 column grid scaling, 2-column cart/checkout. | Rejected hiding mobile preview frame on auth pages; preserved `DeviceFrameWrapper` 414 × 896 canvas. | Viewport scaling tests & `npm run typecheck` |
| **Phase 5: Async & Cart Audit** | Antigravity AI | Implement stale-response search shielding and cart persistence revalidation tests. | `AbortController` cancellation, `latestRequestIdRef` sequence check, `revalidateCart()` stock clamping. | None. | `npm test` automated test suite (3/3 passed) |

---

## 2. Concrete Examples of AI Misunderstandings & Corrections

### Example 1: Splash Screen Logo Visual Misalignment
- **AI Recommendation:** AI generated a generic orange/green carrot icon component for the Splash screen logo.
- **User Feedback / Spec Correction:** The Figma reference required an all-white Nectar/Ahoum vegetable/leaf logo mark on the green background.
- **Correction Applied:** Replaced the carrot icon in `SplashScreenPage.tsx` with exact SVG vector paths filled with `#FFFFFF` and positioned at the 40% vertical height mark.
- **Verification:** Verified visual match against Figma screenshot and confirmed 100% build pass.

### Example 2: Onboarding Navigation Bypassing Sign In Landing Screen
- **AI Recommendation:** In `OnboardingPage.tsx`, AI set `handleGetStarted` to navigate directly to `/auth/location`.
- **User Feedback / Spec Correction:** The mandatory assignment user flow required `Splash → Onboarding → Sign In → Mobile Number → Verification → Select Location → Login → Home`.
- **Correction Applied:** Updated `handleGetStarted` in `OnboardingPage.tsx` to `navigate('/auth')`, correctly rendering `SignInPage.tsx` ("Get your groceries with nectar").
- **Verification:** Verified end-to-end navigation from `/` to `/onboarding` to `/auth` to `/auth/phone` to `/verification` to `/auth/location` to `/login` to `/home`.
