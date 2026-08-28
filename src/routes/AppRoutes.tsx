import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Grocery App Main Pages
import { HomePage } from '../pages/HomePage';
import { ExplorePage } from '../pages/ExplorePage';
import { CategoryPage } from '../pages/CategoryPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { SearchPage } from '../pages/SearchPage';
import { FilterPage } from '../pages/FilterPage';
import { FavoritesPage } from '../pages/FavoritesPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CheckoutSuccessPage } from '../pages/CheckoutSuccessPage';
import { OrderAcceptedPage } from '../pages/OrderAcceptedPage';
import { OrderFailedPage } from '../pages/OrderFailedPage';

// Auth & Onboarding Flow Pages
import { SplashScreenPage } from '../pages/auth/SplashScreenPage';
import { OnboardingPage } from '../pages/auth/OnboardingPage';
import { SignInPage } from '../pages/auth/SignInPage';
import { PhoneInputPage } from '../pages/auth/PhoneInputPage';
import { VerificationPage } from '../pages/auth/VerificationPage';
import { LocationSelectionPage } from '../pages/auth/LocationSelectionPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { SignUpPage } from '../pages/auth/SignUpPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Main Grocery App Routes (Includes Header & BottomNav) */}
      <Route element={<MainLayout />}>
        <Route path="home" element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="filters" element={<FilterPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-accepted" element={<OrderAcceptedPage />} />
        <Route path="order-failed" element={<OrderFailedPage />} />
        <Route path="account" element={<Navigate to="/auth/location" replace />} />
        <Route path="checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="checkout/failure" element={<OrderFailedPage />} />
      </Route>

      {/* 2. Dedicated Startup & Auth Routes (414 x 896 Mobile App Frame, NO Header/BottomNav) */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<SplashScreenPage />} />
        <Route path="welcome" element={<SplashScreenPage />} />
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route path="signin" element={<SignInPage />} />
        <Route path="auth" element={<SignInPage />} />
        <Route path="auth/phone" element={<PhoneInputPage />} />
        <Route path="verification" element={<VerificationPage />} />
        <Route path="auth/verify" element={<VerificationPage />} />
        <Route path="auth/location" element={<LocationSelectionPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
