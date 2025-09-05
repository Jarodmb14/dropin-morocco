import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface TouchOptimizedButtonProps extends ButtonProps {
  touchFeedback?: boolean;
  hapticFeedback?: boolean;
  minTouchTarget?: boolean;
}

const TouchOptimizedButton: React.FC<TouchOptimizedButtonProps> = ({
  children,
  className,
  touchFeedback = true,
  hapticFeedback = true,
  minTouchTarget = true,
  onClick,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const isMobile = useIsMobile();

  const handleTouchStart = () => {
    if (touchFeedback) {
      setIsPressed(true);
    }
    
    // Haptic feedback for mobile devices
    if (hapticFeedback && isMobile && navigator.vibrate) {
      navigator.vibrate(10); // Very short vibration
    }
  };

  const handleTouchEnd = () => {
    if (touchFeedback) {
      setIsPressed(false);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Provide visual feedback even on non-touch devices
    if (!isMobile && touchFeedback) {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 100);
    }
    
    onClick?.(e);
  };

  const touchOptimizedClasses = cn(
    // Base touch optimizations
    isMobile && [
      // Ensure minimum touch target size (44px)
      minTouchTarget && 'min-h-[44px] min-w-[44px]',
      // Better touch feedback
      'active:scale-95 transition-transform duration-75',
      // Improved touch area
      'touch-manipulation',
      // Prevent text selection on touch
      'select-none',
    ],
    // Visual feedback when pressed
    touchFeedback && isPressed && [
      'scale-95 brightness-90',
    ],
    // Enhanced visual states for mobile
    isMobile && [
      'focus:ring-4 focus:ring-primary/20',
      'active:ring-4 active:ring-primary/30',
    ],
    className
  );

  return (
    <Button
      {...props}
      className={touchOptimizedClasses}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      {children}
    </Button>
  );
};

export default TouchOptimizedButton;
