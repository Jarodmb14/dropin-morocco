import React, { useState } from 'react';
import { Card, CardProps } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileCardProps extends CardProps {
  touchable?: boolean;
  onTap?: () => void;
  hapticFeedback?: boolean;
  pressAnimation?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
}

const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className,
  touchable = false,
  onTap,
  hapticFeedback = true,
  pressAnimation = true,
  rounded = 'lg',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const isMobile = useIsMobile();

  const handleTouchStart = () => {
    if (touchable && pressAnimation) {
      setIsPressed(true);
    }
    
    // Haptic feedback for mobile devices
    if (hapticFeedback && isMobile && touchable && navigator.vibrate) {
      navigator.vibrate(5); // Very light haptic feedback
    }
  };

  const handleTouchEnd = () => {
    if (touchable && pressAnimation) {
      setIsPressed(false);
    }
  };

  const handleClick = () => {
    if (touchable) {
      // Provide visual feedback even on non-touch devices
      if (!isMobile && pressAnimation) {
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 100);
      }
      
      onTap?.();
    }
  };

  const mobileOptimizedClasses = cn(
    // Base mobile optimizations
    isMobile && [
      // Better spacing and padding for touch
      'p-6',
      // Enhanced shadows and borders for depth
      'shadow-lg border-2',
      // Smooth interactions
      'transition-all duration-200 ease-out',
    ],
    // Touchable enhancements
    touchable && [
      'cursor-pointer',
      // Touch manipulation optimization
      'touch-manipulation select-none',
      // Focus and hover states
      'hover:shadow-xl hover:border-primary/20',
      'focus:ring-4 focus:ring-primary/20 focus:outline-none',
      // Active state for better feedback
      isMobile && 'active:shadow-md',
    ],
    // Press animation
    pressAnimation && isPressed && touchable && [
      'scale-[0.98] shadow-md',
    ],
    // Rounded corners based on prop
    {
      'rounded-sm': rounded === 'sm',
      'rounded-md': rounded === 'md', 
      'rounded-lg': rounded === 'lg',
      'rounded-xl': rounded === 'xl',
    },
    className
  );

  const cardProps = {
    ...props,
    className: mobileOptimizedClasses,
    ...(touchable && {
      onClick: handleClick,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleTouchStart,
      onMouseUp: handleTouchEnd,
      onMouseLeave: handleTouchEnd,
      tabIndex: 0,
      role: 'button',
      'aria-pressed': isPressed,
    }),
  };

  return (
    <Card {...cardProps}>
      {children}
    </Card>
  );
};

export default MobileCard;
