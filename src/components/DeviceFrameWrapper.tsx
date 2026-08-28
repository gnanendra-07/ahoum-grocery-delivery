import React from 'react';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
  bgColor?: string;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({
  children,
  bgColor = 'bg-gray-50',
}) => {
  return (
    <div className={`min-h-screen w-full ${bgColor} flex flex-col relative`}>
      {children}
    </div>
  );
};
