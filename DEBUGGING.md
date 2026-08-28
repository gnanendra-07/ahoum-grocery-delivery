# Debugging Log — Ahoum Grocery Delivery Application

This log documents real, verified issues encountered during project development, diagnosis steps, root causes, fixes applied, and verification procedures.

---

## Issue 1: React Router v6 Layout Route Collision Overriding `/login` & `/signup`

- **Environment:** React Router v6 / `src/routes/AppRoutes.tsx`
- **Symptom:** Navigating directly to `/login` or `/signup` failed to render the authentication components or redirected back to home.
- **Diagnosis:** Inspected `AppRoutes.tsx` route matching structure. Noticed `<Route path="/" element={<MainLayout />}>` was defined with `path="/"`.
- **Root Cause:** In React Router v6, specifying `path="/"` on a parent layout route causes it to act as a prefix matcher for all paths starting with `/`. Consequently, requests for `/login` matched `MainLayout` instead of falling through to `<Route element={<AuthLayout />}>`.
- **Fix:** Removed `path="/"` from `MainLayout` route declaration: `<Route element={<MainLayout />}>`. Now `MainLayout` only matches its explicit child paths (`home`, `explore`, `cart`, `checkout`), allowing auth routes to render cleanly inside `AuthLayout`.
- **Verification:** Verified `/login`, `/signup`, `/verification`, and `/auth` routes directly in browser and via `npm run typecheck` & `npm run build`.

---

## Issue 2: Onboarding "Get Started" Navigation Bypassing Sign In Landing Page

- **Environment:** Authentication Flow / `src/pages/auth/OnboardingPage.tsx`
- **Symptom:** Clicking "Get Started" on the Onboarding screen skipped the Sign In landing screen (`SignInPage.tsx`) and navigated directly to Location Selection (`/auth/location`).
- **Diagnosis:** Traced navigation callbacks in `OnboardingPage.tsx`. Found `handleGetStarted` was calling `navigate('/auth/location')`.
- **Root Cause:** Incomplete flow configuration where `handleGetStarted` target had been temporarily pointed to location selection during earlier testing.
- **Fix:** Updated `handleGetStarted` in `OnboardingPage.tsx` to `navigate('/auth')`, which correctly renders `SignInPage.tsx` ("Get your groceries with nectar").
- **Verification:** Verified complete flow sequence: `Splash → Onboarding → Sign In → Mobile Number → Verification → Select Location → Login → Home`.

---

## Issue 3: Vertical Button Occlusion & Layout Shift on Auth Screens

- **Environment:** Mobile Number & OTP Verification Screens (`PhoneInputPage.tsx`, `VerificationPage.tsx`)
- **Symptom:** On 414 × 896 mobile canvas, the 67 × 67 px green circular continue button was positioned at the extreme bottom edge, causing visual truncation and potential keyboard occlusion when input fields were focused.
- **Diagnosis:** `PhoneInputPage.tsx` used `justify-between` on the root container, pushing the bottom action div to the bottom padding boundary.
- **Root Cause:** Absolute bottom flex positioning without upper-middle flow alignment.
- **Fix:** Restructured the layout inside `PhoneInputPage.tsx` and `VerificationPage.tsx` to place the 67 × 67 px green circular button directly below the input fields (`pt-12 pr-1` in content flow).
- **Verification:** Verified button stays keyboard-aware, right-aligned, and perfectly visible in the lower-middle region matching Figma designs.

---

## Issue 4: Potential Out-of-Order Search Response Race Condition

- **Environment:** Asynchronous Search Input (`SearchPage.tsx`)
- **Symptom:** Rapid keystrokes in search input could allow a delayed slow network response (e.g. Request 1 for "egg" with 800ms delay) to overwrite a fast response (e.g. Request 2 for "apple" with 200ms delay).
- **Diagnosis:** Inspected asynchronous promise handling in `SearchPage.tsx`. Found search promises were not cancelled or sequence-validated upon new query entry.
- **Root Cause:** Missing `AbortController` cancellation signal and missing request ID generation checking.
- **Fix:** Integrated `AbortController` signal into `mockApi.searchProducts` and maintained `latestRequestIdRef` sequence counter in `SearchPage.tsx`.
- **Verification:** Created automated test suite in `src/tests/standalone.test.ts` (`npm test`) confirming out-of-order responses are rejected.
