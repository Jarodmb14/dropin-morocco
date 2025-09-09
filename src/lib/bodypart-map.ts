/**
 * Body Part Mapping
 * 
 * Maps SVG path IDs from the interactive body diagram to internal keys
 * used for filtering exercises. This provides a clean abstraction between
 * the UI layer and the exercise data layer.
 */

// SVG id -> internal key used to filter exercises
export const BODY_PART_MAP: Record<string, string> = {
  // Front view body parts
  'chest': 'chest',
  'shoulders': 'shoulders', 
  'biceps': 'biceps',
  'triceps': 'triceps',
  'abs': 'abs',            // Maps to 'waist' in ExerciseDB API
  'glutes': 'glutes',      // Maps to 'upper legs' in ExerciseDB API
  'legs': 'legs',          // Maps to 'upper legs' in ExerciseDB API
  
  // Back view body parts (same as front for most)
  'back': 'back',
  
  // Additional muscle groups that could be added to SVG
  'forearms': 'lower_arms',
  'obliques': 'waist',     // Part of core/abs area
  'lats': 'back',          // Part of back
  'traps': 'back',         // Part of back
  'lower_back': 'back',    // Part of back
  'quads': 'upper_legs',   // Part of legs
  'hamstrings': 'upper_legs', // Part of legs
  'calves': 'lower_legs',  // Part of legs
  'neck': 'neck',
};

/**
 * Reverse mapping: internal key -> SVG id
 * Useful for finding which SVG element corresponds to an exercise target
 */
export const REVERSE_BODY_PART_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(BODY_PART_MAP).map(([svgId, internalKey]) => [internalKey, svgId])
);

/**
 * ExerciseDB API mapping
 * Maps internal keys to ExerciseDB API body part names
 */
export const EXERCISE_DB_MAP: Record<string, string> = {
  'chest': 'chest',
  'shoulders': 'shoulders',
  'biceps': 'upper_arms',
  'triceps': 'upper_arms', 
  'abs': 'waist',
  'glutes': 'upper_legs',
  'legs': 'upper_legs',
  'back': 'back',
  'forearms': 'lower_arms',
  'obliques': 'waist',
  'lats': 'back',
  'traps': 'back',
  'lower_back': 'back',
  'quads': 'upper_legs',
  'hamstrings': 'upper_legs',
  'calves': 'lower_legs',
  'neck': 'neck',
};

/**
 * Get the ExerciseDB API body part name for a given SVG ID
 */
export function getExerciseDBBodyPart(svgId: string): string {
  const internalKey = BODY_PART_MAP[svgId];
  return internalKey ? EXERCISE_DB_MAP[internalKey] || internalKey : svgId;
}

/**
 * Get the SVG ID for a given internal key
 */
export function getSvgId(internalKey: string): string {
  return REVERSE_BODY_PART_MAP[internalKey] || internalKey;
}

/**
 * Get all available SVG IDs
 */
export function getAvailableSvgIds(): string[] {
  return Object.keys(BODY_PART_MAP);
}

/**
 * Get all available internal keys
 */
export function getAvailableInternalKeys(): string[] {
  return Object.values(BODY_PART_MAP);
}

/**
 * Check if an SVG ID is valid
 */
export function isValidSvgId(svgId: string): boolean {
  return svgId in BODY_PART_MAP;
}

/**
 * Check if an internal key is valid
 */
export function isValidInternalKey(internalKey: string): boolean {
  return Object.values(BODY_PART_MAP).includes(internalKey);
}
