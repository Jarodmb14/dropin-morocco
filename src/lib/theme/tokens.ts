// Theme tokens for Drop-In Morocco - Comic/Manga Sport Theme
// Vibrant, energetic colors with Moroccan cultural elements

export const themeTokens = {
  // Base colors - Comic/Manga inspired
  base: {
    primary: '#FF6B35', // Energetic Orange
    secondary: '#004E89', // Bold Blue 
    accent: '#FFD23F', // Dynamic Yellow
    white: '#FFFFFF',
    black: '#1A1A1A',
    background: '#F8F9FA', // Clean comic background
  },

  // Standing levels with Sport/Comic names
  standing: {
    // Rookie level - Fresh Energy Green
    rookie: {
      bg: '#00C851', // Bright green
      text: '#FFFFFF',
      border: '#00A041',
      light: '#4DD882',
      dark: '#00952F',
      accent: '#E8F8F0',
    },

    // Pro level - Electric Blue (Moroccan Atlas inspiration)
    pro: {
      bg: '#007BFF', // Electric blue
      text: '#FFFFFF', 
      border: '#0056B3',
      light: '#40A9FF',
      dark: '#004085',
      accent: '#E3F2FF',
    },

    // Champion level - Power Purple (Royal Moroccan)
    champion: {
      bg: '#6F42C1', // Royal purple
      text: '#FFFFFF',
      border: '#59359A',
      light: '#8E6ED7',
      dark: '#4A2C85',
      accent: '#F4F0FF',
    },

    // Legend level - Fire Red with Gold (Moroccan flag inspiration)
    legend: {
      bg: '#DC3545', // Bold red
      text: '#FFFFFF',
      border: '#C82333',
      light: '#E66473',
      dark: '#A71E2A',
      accent: '#FFF0F1',
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

  // Gradients for comic/manga effects
  gradients: {
    primary: 'linear-gradient(135deg, #FF6B35 0%, #FF8A65 100%)',
    rookie: 'linear-gradient(135deg, #00C851 0%, #4DD882 100%)',
    pro: 'linear-gradient(135deg, #007BFF 0%, #40A9FF 100%)',
    champion: 'linear-gradient(135deg, #6F42C1 0%, #8E6ED7 100%)',
    legend: 'linear-gradient(135deg, #DC3545 0%, #FFD700 50%, #DC3545 100%)',
    energetic: 'linear-gradient(135deg, #FF6B35 0%, #007BFF 50%, #6F42C1 100%)',
    moroccan: 'linear-gradient(135deg, #DC3545 0%, #FFD700 100%)', // Flag colors
  },

  // Shadow system
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    rookie: '0 10px 25px -5px rgb(0 200 81 / 0.3)',
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
export const getStandingColors = (tier: 'rookie' | 'pro' | 'champion' | 'legend') => {
  return themeTokens.standing[tier];
};

export const getStandingGradient = (tier: 'rookie' | 'pro' | 'champion' | 'legend') => {
  return themeTokens.gradients[tier];
};

// Type definitions
export type StandingTier = 'rookie' | 'pro' | 'champion' | 'legend';
export type ColorVariant = 'bg' | 'text' | 'border' | 'light' | 'dark' | 'accent';

// CSS custom properties for use in components
export const cssVariables = {
  '--color-primary': themeTokens.base.primary,
  '--color-secondary': themeTokens.base.secondary,
  '--color-accent': themeTokens.base.accent,
  '--color-rookie': themeTokens.standing.rookie.bg,
  '--color-pro': themeTokens.standing.pro.bg,
  '--color-champion': themeTokens.standing.champion.bg,
  '--color-legend': themeTokens.standing.legend.bg,
  '--color-legend-gold': themeTokens.standing.legend.gold,
  '--gradient-primary': themeTokens.gradients.primary,
  '--gradient-energetic': themeTokens.gradients.energetic,
  '--gradient-moroccan': themeTokens.gradients.moroccan,
  '--shadow-standard': themeTokens.shadows.standard,
  '--shadow-premium': themeTokens.shadows.premium,
  '--shadow-luxury': themeTokens.shadows.luxury,
};
