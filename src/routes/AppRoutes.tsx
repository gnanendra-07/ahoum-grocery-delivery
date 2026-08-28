import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { useAuthStore } from '../stores/useAuthStore';

// Grocery App Main Pages
import { HomePage } from '../pages/HomePage';
import { CategoryPage } from '../pages/CategoryPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { SearchPage } from '../pages/SearchPage';
import { FavoritesPage } from '../pages/FavoritesPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CheckoutSuccessPage } from '../pages/CheckoutSuccessPage';
import { CheckoutFailurePage } from '../pages/CheckoutFailurePage';

// Auth & Onboarding Flow Pages
import { SplashScreenPage } from '../pages/auth/SplashScreenPage';
import { OnboardingPage } from '../pages/auth/OnboardingPage';
import { AuthLandingPage } from '../pages/auth/AuthLandingPage';
import { PhoneInputPage } from '../pages/auth/PhoneInputPage';
import { OtpVerificationPage } from '../pages/auth/OtpVerificationPage';
import { LocationSelectionPage } from '../pages/auth/LocationSelectionPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { SignUpPage } from '../pages/auth/SignUpPage';

/**
 * RootHomeGuard ensures unauthenticated users land directly on /welcome.
 * Only authenticated users can access the Grocery Home page.
 */
const RootHomeGuard: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  return <HomePage />;
};

/**
 * AuthRouteGuard prevents authenticated users from returning to auth screens.
 */
const AuthRouteGuard: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Main Grocery App Routes (Includes Header & BottomNav) */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<RootHomeGuard />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="checkout/failure" element={<CheckoutFailurePage />} />
      </Route>

      {/* 2. Dedicated Auth & Onboarding Routes (414 x 896 Mobile App Frame, NO Header/BottomNav) */}
      <Route element={<AuthLayout />}>
        <Route path="welcome" element={<AuthRouteGuard><SplashScreenPage /></AuthRouteGuard>} />
        <Route path="onboarding" element={<AuthRouteGuard><OnboardingPage /></AuthRouteGuard>} />
        <Route path="auth" element={<AuthRouteGuard><AuthLandingPage /></AuthRouteGuard>} />
        <Route path="auth/phone" element={<AuthRouteGuard><PhoneInputPage /></AuthRouteGuard>} />
        <Route path="auth/verify" element={<AuthRouteGuard><OtpVerificationPage /></AuthRouteGuard>} />
        <Route path="auth/location" element={<LocationSelectionPage />} />
        <Route path="login" element={<AuthRouteGuard><LoginPage /></AuthRouteGuard>} />
        <Route path="signup" element={<AuthRouteGuard><SignUpPage /></AuthRouteGuard>} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
