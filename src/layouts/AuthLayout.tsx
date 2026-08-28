import React from 'react';
import { Outlet } from 'react-router-dom';
import { DeviceFrameWrapper } from '../components/DeviceFrameWrapper';

export const AuthLayout: React.FC = () => {
  return (
    <DeviceFrameWrapper bgColor="bg-white">
      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>
    </DeviceFrameWrapper>
  );
};
