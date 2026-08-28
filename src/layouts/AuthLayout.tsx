import React from 'react';
import { Outlet } from 'react-router-dom';
import { DeviceFrameWrapper } from '../components/DeviceFrameWrapper';

export const AuthLayout: React.FC = () => {
  return (
    <DeviceFrameWrapper bgColor="bg-slate-900">
      <main className="flex-1 flex flex-col justify-center items-center w-full max-w-md mx-auto p-4 sm:py-10">
        <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 min-h-[80vh] flex flex-col">
          <Outlet />
        </div>
      </main>
    </DeviceFrameWrapper>
  );
};
