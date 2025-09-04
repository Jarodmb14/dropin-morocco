// Theme tokens for Drop-In Morocco wellness app
// Sophisticated color system with dusty pink base and tier-specific colors

export const themeTokens = {
  // Base colors
  base: {
    dustyPink: '#E3BFC0',
    white: '#FFFFFF',
    black: '#000000',
  },

  // Standing levels with Moroccan-inspired names
  standing: {
    // Standard level - Palm Green (representing oasis and nature)
    standard: {
      bg: '#6BAA75',
      text: '#FFFFFF',
      border: '#5A9664',
      light: '#8BC297',
      dark: '#4F8A5A',
      accent: '#E8F5EA',
    },

    // Premium level - Majorelle Blue (inspired by Majorelle Garden, Marrakech)
    premium: {
      bg: '#2A5C8D',
      text: '#FFFFFF', 
      border: '#1E4A6F',
      light: '#3A6FA5',
      dark: '#1A4058',
      accent: '#E3EBF3',
    },

    // Luxury level - Terracotta Coral with Gold accents (Moroccan sunset & luxury)
    luxury: {
      bg: '#E28B6B',
      text: '#FFFFFF',
      border: '#D67451',
      light: '#E9A485',
      dark: '#C7703E',
      accent: '#FDF4F1',
      gold: '#FFD700',
      goldDark: '#E6C200',
    },
  },

  // Neutral colors for text and backgrounds
  neutral: {
    50: '#FAF9F9',
    100: '#F5F2F3',
    200: '#EBE5E6',
    300: '#DDD4D6',
    400: '#C9BCC0',
    500: '#B5A4A8',
    600: '#9D8B90',
    700: '#7D6B70',
    800: '#5D4F53',
    900: '#3D3437',
  },

  // Supporting colors
  semantic: {
    success: {
      bg: '#10B981',
      text: '#FFFFFF',
      border: '#059669',
      light: '#34D399',
      accent: '#ECFDF5',
    },
    warning: {
      bg: '#F59E0B',
      text: '#FFFFFF',
      border: '#D97706',
      light: '#FBBF24',
      accent: '#FFFBEB',
    },
    error: {
      bg: '#EF4444',
      text: '#FFFFFF',
      border: '#DC2626',
      light: '#F87171',
      accent: '#FEF2F2',
    },
    info: {
      bg: '#3B82F6',
      text: '#FFFFFF',
      border: '#2563EB',
      light: '#60A5FA',
      accent: '#EFF6FF',
    },
  },

  // Gradients for magical effects
  gradients: {
    dustyPink: 'linear-gradient(135deg, #E3BFC0 0%, #D4A5A7 100%)',
    standard: 'linear-gradient(135deg, #6BAA75 0%, #5A9664 100%)',
    premium: 'linear-gradient(135deg, #2A5C8D 0%, #1E4A6F 100%)',
    luxury: 'linear-gradient(135deg, #E28B6B 0%, #C7703E 100%)',
    luxuryGold: 'linear-gradient(135deg, #E28B6B 0%, #FFD700 50%, #C7703E 100%)',
    magical: 'linear-gradient(135deg, #E3BFC0 0%, #6BAA75 50%, #2A5C8D 100%)',
  },

  // Shadow system
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    dustyPink: '0 10px 25px -5px rgb(227 191 192 / 0.3)',
    standard: '0 10px 25px -5px rgb(107 170 117 / 0.3)',
    premium: '0 10px 25px -5px rgb(42 92 141 / 0.3)',
    luxury: '0 10px 25px -5px rgb(226 139 107 / 0.3)',
  },

  // Border radius for consistency
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    full: '9999px',
  },

  // Typography scale
  fontSize: {
    xs: ['12px', { lineHeight: '16px' }],
    sm: ['14px', { lineHeight: '20px' }],
    base: ['16px', { lineHeight: '24px' }],
    lg: ['18px', { lineHeight: '28px' }],
    xl: ['20px', { lineHeight: '28px' }],
    '2xl': ['24px', { lineHeight: '32px' }],
    '3xl': ['30px', { lineHeight: '36px' }],
    '4xl': ['36px', { lineHeight: '40px' }],
    '5xl': ['48px', { lineHeight: '1' }],
    '6xl': ['60px', { lineHeight: '1' }],
    '7xl': ['72px', { lineHeight: '1' }],
  },
} as const;

// Helper functions for easy access
export const getStandingColors = (tier: 'standard' | 'premium' | 'luxury') => {
  return themeTokens.standing[tier];
};

export const getStandingGradient = (tier: 'standard' | 'premium' | 'luxury') => {
  return themeTokens.gradients[tier];
};

// Type definitions
export type StandingTier = 'standard' | 'premium' | 'luxury';
export type ColorVariant = 'bg' | 'text' | 'border' | 'light' | 'dark' | 'accent';

// CSS custom properties for use in components
export const cssVariables = {
  '--color-dusty-pink': themeTokens.base.dustyPink,
  '--color-standard': themeTokens.standing.standard.bg,
  '--color-premium': themeTokens.standing.premium.bg,
  '--color-luxury': themeTokens.standing.luxury.bg,
  '--color-luxury-gold': themeTokens.standing.luxury.gold,
  '--gradient-dusty-pink': themeTokens.gradients.dustyPink,
  '--gradient-magical': themeTokens.gradients.magical,
  '--shadow-dusty-pink': themeTokens.shadows.dustyPink,
};
