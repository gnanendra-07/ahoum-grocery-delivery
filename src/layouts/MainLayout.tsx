import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { DeviceFrameWrapper } from '../components/DeviceFrameWrapper';
import { DesktopHeader } from '../components/DesktopHeader';

/** True when the viewport is large enough for the full desktop home experience */
const useIsDesktopWide = (): boolean => {
  const [isDesktopWide, setIsDesktopWide] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth >= 1024
  );

  useEffect(() => {
    const handleResize = () => setIsDesktopWide(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktopWide;
};

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const isDesktopWide = useIsDesktopWide();

  const isHomePage = location.pathname === '/home' || location.pathname === '/';
  const isFilterPage = location.pathname === '/filters';
  const isCheckoutPage = location.pathname === '/checkout';
  const isOrderAcceptedPage = location.pathname === '/order-accepted';
  const isOrderFailedPage =
    location.pathname === '/order-failed' || location.pathname === '/checkout/failure';
  const isStandalonePage =
    isFilterPage || isCheckoutPage || isOrderAcceptedPage || isOrderFailedPage;

  // ── Desktop Home: full-width layout, no phone-frame ──────────────────────
  // Only applies when viewport >= 1024px AND we're on the home route.
  const showDesktopHome = isHomePage && isDesktopWide;

  useEffect(() => {
    // Toggle the .desktop-home class on <html> so index.css can permit
    // document-level scrolling for the full-width home page.
    if (showDesktopHome) {
      document.documentElement.classList.add('desktop-home');
    } else {
      document.documentElement.classList.remove('desktop-home');
    }
    return () => {
      document.documentElement.classList.remove('desktop-home');
    };
  }, [showDesktopHome]);

  if (showDesktopHome) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DesktopHeader />
        <main className="flex-1 w-full">
          <div className="max-w-[1400px] mx-auto px-6 xl:px-10 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    );
  }

  // ── Default: existing phone-frame layout (mobile + tablet + non-home) ────
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
