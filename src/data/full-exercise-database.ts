import { ExerciseWithAttributes } from '../types/exercise';
import { ALL_EXERCISES } from './generate-all-exercises';

// FULL EXERCISE DATABASE - 120 exercises (15 per body part)
export const FULL_EXERCISE_DATABASE: ExerciseWithAttributes[] = ALL_EXERCISES;

// Helper functions for full exercise database
export function getFullExercisesByMuscleGroup(muscleGroup: string): ExerciseWithAttributes[] {
  return FULL_EXERCISE_DATABASE.filter(exercise => {
    const primaryMuscle = getPrimaryMuscle(exercise);
    const secondaryMuscles = getSecondaryMuscles(exercise);
    
    const muscleMapping: Record<string, string[]> = {
      'chest': ['CHEST', 'PECTORALS'],
      'shoulders': ['SHOULDERS', 'DELTOIDS'],
      'biceps': ['BICEPS'],
      'triceps': ['TRICEPS'],
      'abs': ['ABS', 'CORE', 'ABDOMINALS'],
      'back': ['BACK', 'LATS', 'RHOMBOIDS', 'TRAPEZIUS'],
      'legs': ['QUADRICEPS', 'HAMSTRINGS', 'CALVES'],
      'glutes': ['GLUTES', 'GLUTEALS'],
      'forearms': ['FOREARMS'],
      'calves': ['CALVES'],
      'full_body': ['FULL_BODY']
    };
    
    const targetMuscles = muscleMapping[muscleGroup] || [];
    
    return targetMuscles.some(muscle => 
      primaryMuscle === muscle || 
      secondaryMuscles.includes(muscle)
    );
  });
}

export function getPrimaryMuscle(exercise: ExerciseWithAttributes): string {
  const primaryMuscles = exercise.attributes
    .filter(attr => attr.attributeName === 'PRIMARY_MUSCLE')
    .map(attr => attr.attributeValue);
  return primaryMuscles[0] || 'FULL_BODY';
}

export function getSecondaryMuscles(exercise: ExerciseWithAttributes): string[] {
  return exercise.attributes
    .filter(attr => attr.attributeName === 'SECONDARY_MUSCLE')
    .map(attr => attr.attributeValue);
}

export function getEquipment(exercise: ExerciseWithAttributes): string[] {
  return exercise.attributes
    .filter(attr => attr.attributeName === 'EQUIPMENT')
    .map(attr => attr.attributeValue);
}
