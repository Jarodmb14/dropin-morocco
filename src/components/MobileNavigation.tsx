import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { 
  Home, 
  MapPin, 
  QrCode, 
  User, 
  Menu,
  Search,
  Heart,
  Calendar,
  Settings
} from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import TouchOptimizedButton from './TouchOptimizedButton';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  action?: () => void;
  badge?: number;
  primary?: boolean;
}

interface MobileNavigationProps {
  currentPath?: string;
  onNavigate?: (item: NavigationItem) => void;
  className?: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentPath = '/',
  onNavigate,
  className
}) => {
  const isMobile = useIsMobile();
  const isNative = Capacitor.isNativePlatform();
  const [isExpanded, setIsExpanded] = useState(false);

  // Primary navigation items (always visible on mobile)
  const primaryItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      href: '/',
      primary: true,
    },
    {
      id: 'search',
      label: 'Find Gyms',
      icon: Search,
      href: '/search',
      primary: true,
    },
    {
      id: 'scan',
      label: 'Scan QR',
      icon: QrCode,
      action: () => console.log('Open QR Scanner'),
      primary: true,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      href: '/profile',
      primary: true,
    },
  ];

  // Secondary navigation items (shown when expanded)
  const secondaryItems: NavigationItem[] = [
    {
      id: 'map',
      label: 'Map View',
      icon: MapPin,
      href: '/map',
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Heart,
      href: '/favorites',
      badge: 3,
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: Calendar,
      href: '/bookings',
      badge: 1,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/settings',
    },
  ];

  const handleItemClick = (item: NavigationItem) => {
    if (item.action) {
      item.action();
    } else {
      onNavigate?.(item);
    }
    
    // Collapse expanded menu after navigation
    if (isExpanded) {
      setIsExpanded(false);
    }
  };

  const NavItem: React.FC<{ 
    item: NavigationItem; 
    isActive?: boolean; 
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
  }> = ({ 
    item, 
    isActive = false, 
    size = 'md',
    showLabel = true
  }) => {
    const IconComponent = item.icon;
    
    const sizeClasses = {
      sm: 'h-8 w-8 p-1',
      md: 'h-12 w-12 p-2',
      lg: 'h-14 w-14 p-3',
    };

    const iconSizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    return (
      <TouchOptimizedButton
        variant={isActive ? 'default' : 'ghost'}
        className={cn(
          'flex flex-col items-center justify-center gap-1 relative',
          sizeClasses[size],
          isActive && 'bg-primary text-primary-foreground shadow-lg',
          !isActive && 'text-muted-foreground hover:text-foreground'
        )}
        onClick={() => handleItemClick(item)}
        hapticFeedback={true}
        minTouchTarget={true}
      >
        <IconComponent className={iconSizes[size]} />
        {showLabel && (
          <span className="text-[10px] font-medium leading-none">
            {item.label}
          </span>
        )}
        
        {/* Badge */}
        {item.badge && item.badge > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {item.badge > 99 ? '99+' : item.badge}
          </div>
        )}
      </TouchOptimizedButton>
    );
  };

  if (!isMobile) {
    // Desktop navigation (simplified)
    return (
      <nav className={cn('flex items-center gap-4', className)}>
        {primaryItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={currentPath === item.href}
            size="sm"
            showLabel={false}
          />
        ))}
      </nav>
    );
  }

  return (
    <>
      {/* Expanded overlay menu */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsExpanded(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border p-4 rounded-t-3xl">
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              {secondaryItems.map((item) => (
                <div key={item.id} className="flex flex-col items-center">
                  <NavItem
                    item={item}
                    isActive={currentPath === item.href}
                    size="lg"
                    showLabel={true}
                  />
                </div>
              ))}
            </div>
            
            {/* Native app indicator */}
            {isNative && (
              <div className="text-center py-2">
                <p className="text-xs text-muted-foreground">
                  🚀 Native App Features Active
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom navigation bar */}
      <nav className={cn(
        'fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-30',
        // Safe area padding for devices with notches
        'pb-safe-bottom',
        className
      )}>
        <div className="flex items-center justify-between px-4 py-2">
          {primaryItems.slice(0, 3).map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={currentPath === item.href}
              size="md"
              showLabel={true}
            />
          ))}
          
          {/* More menu button */}
          <TouchOptimizedButton
            variant="ghost"
            className="flex flex-col items-center justify-center gap-1 h-12 w-12 p-2 relative"
            onClick={() => setIsExpanded(!isExpanded)}
            hapticFeedback={true}
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">More</span>
            
            {/* Notification dot for secondary items with badges */}
            {secondaryItems.some(item => item.badge && item.badge > 0) && (
              <div className="absolute top-1 right-1 bg-red-500 rounded-full h-2 w-2" />
            )}
          </TouchOptimizedButton>
          
          {primaryItems.slice(3).map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={currentPath === item.href}
              size="md"
              showLabel={true}
            />
          ))}
        </div>
        
        {/* Home indicator for iOS-style navigation */}
        {isNative && (
          <div className="h-1 w-32 bg-foreground/20 rounded-full mx-auto mb-1" />
        )}
      </nav>
      
      {/* Spacer to prevent content from being hidden behind nav */}
      <div className="h-20" />
    </>
  );
};

export default MobileNavigation;
