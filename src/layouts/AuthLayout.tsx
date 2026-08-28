import React from 'react';
import { Outlet } from 'react-router-dom';
import { DeviceFrameWrapper } from '../components/DeviceFrameWrapper';

export const AuthLayout: React.FC = () => {
  return (
    <DeviceFrameWrapper bgColor="bg-white">
      <main className="flex-1 w-full flex flex-col p-0">
        <Outlet />
      </main>
    </DeviceFrameWrapper>
  );
};
