import React, { useState, useEffect } from 'react';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
  bgColor?: string;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({
  children,
  bgColor = 'bg-gray-50',
}) => {
  const [scale, setScale] = useState<number>(1);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 640;
      setIsDesktop(desktop);
      if (desktop) {
        // Tight padding around phone frame for maximal preview size
        const paddingW = 20;
        const paddingH = 20;
        const availableW = window.innerWidth - paddingW;
        const availableH = window.innerHeight - paddingH;
        const scaleW = availableW / 414;
        const scaleH = availableH / 896;
        const fitScale = Math.min(1, Math.min(scaleW, scaleH));
        setScale(Math.max(0.45, fitScale));
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

  // Desktop proportional device scale frame (>=640px)
  const scaledWidth = 414 * scale;
  const scaledHeight = 896 * scale;

  return (
    <div className="h-screen w-screen bg-slate-950 flex items-center justify-center overflow-hidden p-0">
      {/* Wrapper box matching scaled footprint */}
      <div
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
        }}
        className="relative flex items-center justify-center flex-shrink-0"
      >
        {/* Exact 414 x 896 CSS px Source Phone Frame */}
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
