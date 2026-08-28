import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { DeviceFrameWrapper } from '../components/DeviceFrameWrapper';

export const MainLayout: React.FC = () => {
  return (
    <DeviceFrameWrapper bgColor="bg-gray-50">
      <Header />
      
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 max-w-7xl mx-auto w-full pb-20 md:pb-8">
        <Outlet />
      </main>

      <BottomNav />
    </DeviceFrameWrapper>
  );
};
