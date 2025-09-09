import { syncExercisesToDatabase } from './exercises.getByBodyPart';

/**
 * Utility script to sync exercises from ExerciseDB API to local Supabase database
 * Run this to populate the local exercises table
 */

export async function runExerciseSync() {
  try {
    console.log('Starting exercise sync...');
    await syncExercisesToDatabase();
    console.log('Exercise sync completed successfully!');
  } catch (error) {
    console.error('Exercise sync failed:', error);
    throw error;
  }
}

// If running this file directly (for testing)
if (typeof window === 'undefined') {
  runExerciseSync().catch(console.error);
}
