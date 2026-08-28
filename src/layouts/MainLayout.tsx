import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { DeviceFrameWrapper } from '../components/DeviceFrameWrapper';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  // Global Header (Ahoum logo, location chip, Search Store bar) renders ONLY on Home Screen ('/home' or '/')
  const isHomePage = location.pathname === '/home' || location.pathname === '/';
  const isFilterPage = location.pathname === '/filters';
  const isCheckoutPage = location.pathname === '/checkout';
  const isOrderAcceptedPage = location.pathname === '/order-accepted';
  const isOrderFailedPage = location.pathname === '/order-failed' || location.pathname === '/checkout/failure';
  const isStandalonePage = isFilterPage || isCheckoutPage || isOrderAcceptedPage || isOrderFailedPage;

  return (
    <DeviceFrameWrapper bgColor="bg-gray-50">
      {isHomePage && <Header />}
      
      <main className={`flex-1 ${isStandalonePage ? 'p-0' : 'px-4 py-3'} w-full flex flex-col`}>
        <Outlet />
      </main>

      {!isStandalonePage && <BottomNav />}
    </DeviceFrameWrapper>
  );
};
