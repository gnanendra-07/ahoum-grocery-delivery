import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Responsive Main Container Shell */}
      <div className="w-full max-w-7xl mx-auto bg-gray-50 min-h-screen shadow-md flex flex-col relative pb-20 md:pb-8 border-x border-gray-200/60">
        <Header />
        
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5">
          <Outlet />
        </main>

        <BottomNav />
      </div>
    </div>
  );
};
