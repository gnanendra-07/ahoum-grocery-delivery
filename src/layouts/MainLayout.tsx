import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-0 sm:p-6 overflow-x-hidden">
      {/* Figma 414 x 896 px Mobile App Frame Proportions Container */}
      <div className="w-full sm:w-[414px] min-h-screen sm:min-h-[896px] sm:h-[896px] bg-gray-50 sm:rounded-[40px] shadow-2xl overflow-y-auto overflow-x-hidden border-0 sm:border-[8px] sm:border-slate-800 flex flex-col relative">
        <Header />
        
        <main className="flex-1 px-4 py-4 pb-20">
          <Outlet />
        </main>

        <BottomNav />
      </div>
    </div>
  );
};
