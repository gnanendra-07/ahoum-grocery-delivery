import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
  bgColor?: string;
}

const getDesktopScale = (): number => {
  if (typeof window === 'undefined') return 0.82;
  // Reserve vertical/horizontal margins so complete phone frame fits with visible dark space top & bottom
  const paddingY = 48; // 24px top and bottom space min
  const paddingX = 32; // 16px left and right space min
  const availableH = window.innerHeight - paddingY;
  const availableW = window.innerWidth - paddingX;
  const scaleH = availableH / 896;
  const scaleW = availableW / 414;
  // Target max scale 0.82 (~339.5px visual width), dynamically scaled down if viewport height/width is smaller
  return Math.max(0.35, Math.min(0.82, Math.min(scaleW, scaleH)));
};

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({
  children,
  bgColor = 'bg-gray-50',
}) => {
  const [scale, setScale] = useState<number>(getDesktopScale);
  const [isDesktop, setIsDesktop] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth >= 640
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Reset internal scroll container to top whenever route changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 640;
      setIsDesktop(desktop);
      if (desktop) {
        setScale(getDesktopScale());
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
    <div className="fixed inset-0 w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden p-0 z-50">
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
          ref={scrollContainerRef}
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

