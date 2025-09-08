// Tier color utilities for consistent design across the application

export type TierType = 'BASIC' | 'STANDARD' | 'PREMIUM' | 'LUXURY';

// Get tier emoji color (for markers, buttons, etc.)
export const getTierEmojiColor = (tier: string): string => {
  switch (tier) {
    case 'BASIC': return '#6BAA75'; // Green
    case 'STANDARD': return '#4A90E2'; // Blue
    case 'PREMIUM': return '#9B59B6'; // Purple
    case 'LUXURY': return '#F39C12'; // Gold
    default: return '#6BAA75'; // Default green
  }
};

// Get tier pastel background color (for page backgrounds)
export const getTierPastelBackground = (tier: string): string => {
  switch (tier) {
    case 'BASIC': return 'bg-green-50'; // Light green
    case 'STANDARD': return 'bg-blue-50'; // Light blue
    case 'PREMIUM': return 'bg-purple-50'; // Light purple
    case 'LUXURY': return 'bg-orange-50'; // Light orange
    default: return 'bg-green-50'; // Default light green
  }
};

// Get tier pastel background with gradient (for enhanced visual appeal)
export const getTierPastelGradient = (tier: string): string => {
  switch (tier) {
    case 'BASIC': return 'bg-gradient-to-br from-green-50 to-green-100'; // Green gradient
    case 'STANDARD': return 'bg-gradient-to-br from-blue-50 to-blue-100'; // Blue gradient
    case 'PREMIUM': return 'bg-gradient-to-br from-purple-50 to-purple-100'; // Purple gradient
    case 'LUXURY': return 'bg-gradient-to-br from-orange-50 to-orange-100'; // Orange gradient
    default: return 'bg-gradient-to-br from-green-50 to-green-100'; // Default green gradient
  }
};

// Get tier accent color (for borders, highlights, etc.)
export const getTierAccentColor = (tier: string): string => {
  switch (tier) {
    case 'BASIC': return 'border-green-200'; // Light green border
    case 'STANDARD': return 'border-blue-200'; // Light blue border
    case 'PREMIUM': return 'border-purple-200'; // Light purple border
    case 'LUXURY': return 'border-orange-200'; // Light orange border
    default: return 'border-green-200'; // Default light green border
  }
};

// Get tier text color (for text that should match the tier)
export const getTierTextColor = (tier: string): string => {
  switch (tier) {
    case 'BASIC': return 'text-green-800'; // Dark green text
    case 'STANDARD': return 'text-blue-800'; // Dark blue text
    case 'PREMIUM': return 'text-purple-800'; // Dark purple text
    case 'LUXURY': return 'text-orange-800'; // Dark orange text
    default: return 'text-green-800'; // Default dark green text
  }
};

// Default pastel background for pages without specific tier
export const getDefaultPastelBackground = (): string => {
  return 'bg-gradient-to-br from-gray-50 to-gray-100';
};

// Get tier emoji
export const getTierEmoji = (tier: string): string => {
  switch (tier) {
    case 'BASIC': return '🏋️'; // Green
    case 'STANDARD': return '🏋️'; // Blue
    case 'PREMIUM': return '🏋️'; // Purple
    case 'LUXURY': return '🏋️'; // Gold
    default: return '🏋️'; // Default green
  }
};
