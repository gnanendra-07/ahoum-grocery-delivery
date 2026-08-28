import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="h-screen min-h-screen bg-slate-950 flex items-center justify-center p-0 sm:p-4 overflow-hidden">
      {/* Figma 414 x 896 px Mobile Device Frame Preview */}
      <div className="box-border w-full h-[100dvh] sm:w-[414px] sm:h-[896px] sm:max-h-[calc(100vh-2rem)] bg-white sm:rounded-[40px] shadow-2xl overflow-y-auto overflow-x-hidden border-0 sm:border-[8px] sm:border-slate-800 flex flex-col relative">
        <main className="flex-1 flex flex-col w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
