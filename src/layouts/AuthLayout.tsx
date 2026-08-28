import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-brand-950 via-slate-900 to-emerald-950 flex flex-col justify-center items-center p-0 sm:p-4 md:p-6 overflow-x-hidden">
      <div className="w-full max-w-md mx-auto min-h-screen sm:min-h-0 flex flex-col justify-center">
        <main className="w-full flex-1 sm:flex-initial">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
