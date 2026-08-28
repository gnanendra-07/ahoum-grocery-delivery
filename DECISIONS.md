# Engineering Decisions — Ahoum Grocery Delivery Application

This document records non-trivial architectural choices, state management design, and engineering trade-offs made during development.

---

## 1. Persisted Cart Integrity & Revalidation Policy

### Context & Problem
Cart state stored in `localStorage` can become stale or corrupted between sessions (e.g. products deleted from catalog, prices updated by merchants, quantities stored exceeding available inventory, or invalid JSON structures).

### Options Considered
1. **Raw Storage Trust:** Load JSON directly from `localStorage` into memory without validation.
   - *Pros:* Simple implementation.
   - *Cons:* Prone to app crashes, pricing errors, and out-of-stock checkout failures.
2. **Strict Server-Controlled Cart:** Fetch cart items from a backend API on every render.
   - *Pros:* Always accurate.
   - *Cons:* Requires a live backend database; unsuited for offline/client-side storage.
3. **Resilient Local Storage + App Mount Revalidation (Chosen Solution):**
   - Implement `loadCartFromStorage()` with defensive type-checking and schema filtering.
   - Trigger `revalidateCart(latestProducts)` on application mount in `App.tsx`.

### Exact Handled Cases & Behavior Matrix

| Edge Case | Detection Mechanism | Handled Action / Behavior |
| :--- | :--- | :--- |
| **a. Product no longer exists** | `!productMap.has(item.product.id)` | Item is automatically removed from cart during `revalidateCart()`. |
| **b. Product price changed** | `latestProd.price !== item.product.price` | Product metadata and price in cart are updated to latest catalog price (`latestProd.price` / `latestProd.discountPrice`). |
| **c. Quantity exceeds stock** | `item.quantity > latestProd.stock` | Item quantity is clamped to `latestProd.stock` (`Math.min(item.quantity, latestProd.stock)`). |
| **d. Product out of stock (stock === 0)** | `latestProd.stock <= 0` | Item is automatically dropped from cart during revalidation. |
| **e. Quantity becomes <= 0** | `quantity <= 0` | Calling `updateQuantity(id, 0)` invokes `removeItem(id)` to purge item. |
| **f. Corrupted JSON / invalid schema** | `JSON.parse` throw or schema type mismatch | `loadCartFromStorage()` catches error cleanly and resets cart to `[]` without crashing. |

---

## 2. Asynchronous Search Race Condition Guarding

### Context & Problem
Rapid user keystrokes in search input fields can trigger multiple asynchronous HTTP/mock requests. If an earlier request (e.g. Request 1 for "egg" with 800ms latency) resolves *after* a later request (e.g. Request 2 for "apple" with 200ms latency), the UI will display stale results for "egg" even though the input field shows "apple".

### Options Considered
1. **Debounce Only:** Delay API invocation by 300ms.
   - *Pros:* Reduces request count.
   - *Cons:* Does not prevent race conditions if network latency varies (e.g. 200ms vs 1200ms).
2. **AbortController Cancellation + Request Counter Sequence Validation (Chosen Solution):**
   - Maintain an `AbortController` instance in a React `useRef`. Cancel previous in-flight requests on new input using `controller.abort()`.
   - Maintain an incremental `latestRequestIdRef` sequence counter. Ignore any promise resolution where `currentRequestId !== latestRequestIdRef.current`.

### Trade-offs & Verification
- **Trade-off:** Adds minor overhead to component state management.
- **Verification:** Verified via automated unit tests in `src/tests/standalone.test.ts` (`npm test`) demonstrating that slow out-of-order responses never overwrite active search results.

---

## 3. Strict Route Nesting & Layout Separation Architecture

### Context & Problem
Mixing fixed 414 × 896 mobile auth screens (Splash, Onboarding, Sign In, Mobile Number, Verification, Select Location, Login, Sign Up) with responsive grocery application routes (`/home`, `/explore`, `/cart`, `/checkout`) can lead to route collisions, double-framing, or unexpected headers appearing on auth pages.

### Options Considered
1. **Single Global Layout Wrapper:** Render global `Header` and `BottomNav` on every page and manually hide them via route conditionals.
   - *Pros:* Single layout file.
   - *Cons:* Fragile, error-prone, hard to maintain.
2. **Separated Sub-tree Layout Routes (`MainLayout` & `AuthLayout`) (Chosen Solution):**
   - `<Route element={<MainLayout />}>` wraps browsing pages with responsive header, main container, and bottom nav.
   - `<Route element={<AuthLayout />}>` wraps authentication flows inside a clean 414 × 896 `DeviceFrameWrapper` without global headers or navigation bars.

### Trade-offs
- Requires clear boundary definition in `AppRoutes.tsx`, but guarantees zero header/nav leaks on mobile authentication screens.
