import React, { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Capacitor } from '@capacitor/core';
import MobileNavigation from './MobileNavigation';

interface MobileLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
  className?: string;
  enableSwipeGestures?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  statusBarStyle?: 'light' | 'dark';
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  showNavigation = true,
  className,
  enableSwipeGestures = false,
  onSwipeLeft,
  onSwipeRight,
  statusBarStyle = 'dark'
}) => {
  const isMobile = useIsMobile();
  const isNative = Capacitor.isNativePlatform();
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  const [swipeStartY, setSwipeStartY] = useState<number | null>(null);

  // Handle status bar styling for native apps
  useEffect(() => {
    if (isNative) {
      // You would typically use @capacitor/status-bar plugin here
      // For now, we'll just add the appropriate CSS classes
      document.body.classList.toggle('status-bar-light', statusBarStyle === 'light');
      document.body.classList.toggle('status-bar-dark', statusBarStyle === 'dark');
    }
  }, [isNative, statusBarStyle]);

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableSwipeGestures) return;
    
    const touch = e.touches[0];
    setSwipeStartX(touch.clientX);
    setSwipeStartY(touch.clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!enableSwipeGestures || swipeStartX === null || swipeStartY === null) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - swipeStartX;
    const deltaY = touch.clientY - swipeStartY;
    
    // Minimum swipe distance (in pixels)
    const minSwipeDistance = 50;
    
    // Check if it's more horizontal than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }
    
    setSwipeStartX(null);
    setSwipeStartY(null);
  };

  const mobileLayoutClasses = cn(
    // Base layout
    'min-h-screen flex flex-col',
    // Mobile-specific optimizations
    isMobile && [
      // Handle safe areas
      'pt-safe-top pb-safe-bottom',
      // Prevent overscroll bounce on iOS
      'overscroll-none',
      // Improve touch interactions
      'touch-manipulation',
      // Prevent zoom on inputs
      'zoom-none',
    ],
    // Native app specific
    isNative && [
      // Full screen on native
      'h-screen overflow-hidden',
      // Status bar adjustments
      statusBarStyle === 'light' ? 'status-bar-light' : 'status-bar-dark',
    ],
    className
  );

  const contentClasses = cn(
    'flex-1 overflow-auto',
    // Mobile content optimizations
    isMobile && [
      // Better scrolling on mobile
      'scroll-smooth',
      // Momentum scrolling on iOS
      'momentum-scroll',
      // Add padding for navigation if shown
      showNavigation && 'pb-20',
    ],
    // Prevent overscroll on native
    isNative && 'overscroll-none',
  );

  return (
    <div 
      className={mobileLayoutClasses}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main content area */}
      <main className={contentClasses}>
        {children}
      </main>
      
      {/* Mobile navigation */}
      {showNavigation && isMobile && (
        <MobileNavigation />
      )}
    </div>
  );
};

export default MobileLayout;
