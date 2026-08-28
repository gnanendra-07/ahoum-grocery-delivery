import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { DeviceFrameWrapper } from '../components/DeviceFrameWrapper';

export const MainLayout: React.FC = () => {
  return (
    <DeviceFrameWrapper bgColor="bg-gray-50">
      <Header />
      
      <main className="flex-1 px-4 py-4">
        <Outlet />
      </main>

      <BottomNav />
    </DeviceFrameWrapper>
  );
};
