// Exercise types based on workout-cool structure
export interface Exercise {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  introduction: string;
  introductionEn: string;
  fullVideoUrl?: string;
  fullVideoImageUrl?: string;
  slug: string;
  slugEn: string;
  attributes: ExerciseAttribute[];
}

export interface ExerciseAttribute {
  attributeName: string;
  attributeValue: string;
}

export interface ExerciseWithAttributes extends Exercise {
  attributes: ExerciseAttribute[];
}

// Muscle groups mapping
export const MUSCLE_GROUPS = {
  CHEST: 'chest',
  SHOULDERS: 'shoulders', 
  BICEPS: 'biceps',
  TRICEPS: 'triceps',
  ABS: 'abs',
  BACK: 'back',
  LEGS: 'legs',
  GLUTES: 'glutes',
  FOREARMS: 'forearms',
  CALVES: 'calves',
  FULL_BODY: 'full_body'
} as const;

export type MuscleGroup = typeof MUSCLE_GROUPS[keyof typeof MUSCLE_GROUPS];

// Exercise types
export const EXERCISE_TYPES = {
  STRENGTH: 'STRENGTH',
  CARDIO: 'CARDIO',
  PLYOMETRICS: 'PLYOMETRICS',
  CROSSFIT: 'CROSSFIT',
  FLEXIBILITY: 'FLEXIBILITY'
} as const;

// Equipment types
export const EQUIPMENT_TYPES = {
  BARBELL: 'BARBELL',
  DUMBBELL: 'DUMBBELL',
  CABLE: 'CABLE',
  BENCH: 'BENCH',
  BODYWEIGHT: 'BODYWEIGHT',
  KETTLEBELL: 'KETTLEBELL',
  ROPE: 'ROPE',
  BAR: 'BAR'
} as const;

// Mechanics types
export const MECHANICS_TYPES = {
  COMPOUND: 'COMPOUND',
  ISOLATION: 'ISOLATION'
} as const;
