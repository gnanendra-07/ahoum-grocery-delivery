import React, { useState, useEffect } from 'react';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
  bgColor?: string;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({
  children,
  bgColor = 'bg-gray-50',
}) => {
  const [scale, setScale] = useState<number>(0.85);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 640;
      setIsDesktop(desktop);
      if (desktop) {
        // Reserve padding so phone mockup fits completely within desktop window
        const padding = 32;
        const availableW = window.innerWidth - padding;
        const availableH = window.innerHeight - padding;
        // Total outer phone frame dimensions including 8px borders
        const totalW = 430;
        const totalH = 912;
        const scaleW = availableW / totalW;
        const scaleH = availableH / totalH;
        // Cap desktop phone preview scale at 0.85 max so it fits comfortably on any screen without overflow
        const fitScale = Math.min(0.85, Math.min(scaleW, scaleH));
        setScale(Math.max(0.35, fitScale));
      } else {
        setScale(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isDesktop) {
    // Real mobile viewport layout (<640px): Fullscreen 100dvh
    return (
      <div className={`w-full h-[100dvh] ${bgColor} flex flex-col relative overflow-y-auto overflow-x-hidden no-scrollbar`}>
        {children}
      </div>
    );
  }

  // Desktop phone mockup preview frame (>=640px)
  const scaledWidth = 414 * scale;
  const scaledHeight = 896 * scale;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-slate-950 flex items-center justify-center overflow-hidden p-0 z-50">
      {/* Wrapper box matching scaled footprint */}
      <div
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
        }}
        className="relative flex items-center justify-center flex-shrink-0"
      >
        {/* Fixed 414 x 896 CSS px Source Phone Frame */}
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
          className={`w-[414px] h-[896px] ${bgColor} rounded-[44px] shadow-2xl border-[8px] border-slate-800 flex flex-col relative overflow-y-auto overflow-x-hidden box-border flex-shrink-0 no-scrollbar`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
