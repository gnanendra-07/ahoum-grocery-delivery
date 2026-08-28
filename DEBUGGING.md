# Debugging Log — Ahoum Frontend Developer Assignment

This log documents actual runtime, build, or architectural issues encountered during development and their verified resolutions.

---

## Issue 1: PowerShell Script Execution Policy Blocking `npm` Command Execution

- **Environment:** Windows OS / PowerShell
- **Symptom:** Running `npm install` returned error:
  `File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.`
- **Root Cause:** PowerShell ExecutionPolicy restricted execution of `.ps1` wrapper scripts.
- **Resolution:** Executed the installation via Command Prompt wrapper (`cmd /c npm install`), bypassing script execution restrictions cleanly without altering system-wide execution policy settings.
- **Status:** Resolved.

---

## Issue 2: PostCSS Directive Syntax Error in `src/index.css`

- **Environment:** Tailwind CSS v3 / PostCSS Build Phase
- **Symptom:** Production build failed with error:
  `@layer base is used but no matching @tailwind base directive is present.`
- **Root Cause:** Typos in CSS directives (`@tailwindcss base;` instead of `@tailwind base;`).
- **Resolution:** Replaced `@tailwindcss` directives with standard `@tailwind base; @tailwind components; @tailwind utilities;` directives.
- **Status:** Resolved.

---

## Issue 3: Potential Out-of-Order Search Response Race Condition

- **Environment:** Asynchronous Search Input (`SearchPage.tsx`)
- **Symptom:** Rapidly typing search queries could allow a delayed slow network response (e.g. Request A for "milk") to overwrite a fast response (e.g. Request B for "bread").
- **Root Cause:** Unhandled asynchronous promise resolution without cancellation or request generation checking.
- **Resolution:** Implemented `AbortController` cancellation + `latestRequestId` counter check. Added reproducible verification test panel in `SearchPage.tsx`.
- **Status:** Resolved & Verified.

---

## Issue 4: Responsive Desktop Layout Contraction

- **Environment:** Desktop Viewports (`MainLayout.tsx`, `Header.tsx`)
- **Symptom:** On wide desktop screens, content remained cramped in a narrow `max-w-md` mobile width box.
- **Root Cause:** Hardcoded fixed mobile max-width wrapper without responsive breakpoint classes.
- **Resolution:** Upgraded wrapper to `max-w-7xl mx-auto`, added responsive grid scaling (`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`), desktop header navigation links (`hidden md:flex`), and 2-column Cart/Checkout layouts.
- **Status:** Resolved & Verified.
