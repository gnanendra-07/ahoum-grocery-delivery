import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
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

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Grocery App Main Routes */}
        <Route index element={<HomePage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="checkout/failure" element={<CheckoutFailurePage />} />

        {/* Figma Authentication & Onboarding Flow Routes */}
        <Route path="welcome" element={<SplashScreenPage />} />
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route path="auth" element={<AuthLandingPage />} />
        <Route path="auth/phone" element={<PhoneInputPage />} />
        <Route path="auth/verify" element={<OtpVerificationPage />} />
        <Route path="auth/location" element={<LocationSelectionPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
