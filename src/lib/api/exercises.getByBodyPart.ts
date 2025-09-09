import { supabase } from '@/integrations/supabase/client';
import { ExerciseDBExercise } from './exercisedb';

/**
 * Server-side function to fetch exercises by body part
 * This function can work with both local database and external API
 */

// Local exercise interface (if we decide to store exercises in Supabase)
export interface LocalExercise {
  id: string;
  name: string;
  body_part: string;
  target: string;
  equipment: string;
  gif_url?: string;
  video_url?: string;
  instructions: string[];
  secondary_muscles: string[];
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
  updated_at: string;
}

/**
 * Fetch exercises from local Supabase database by body part
 * This assumes we have an 'exercises' table in Supabase
 */
export async function getExercisesByBodyPartFromDB(
  bodyPart: string, 
  limit: number = 50
): Promise<LocalExercise[]> {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .or(`body_part.eq.${bodyPart},target.eq.${bodyPart}`)
      .order('name', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching exercises from database:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Database query failed:', error);
    throw error;
  }
}

/**
 * Fetch exercises from ExerciseDB API by body part
 * This is the current implementation using the external API
 */
export async function getExercisesByBodyPartFromAPI(
  bodyPart: string, 
  limit: number = 50
): Promise<ExerciseDBExercise[]> {
  try {
    const RAPIDAPI_HOST = 'exercisedb.p.rapidapi.com';
    const RAPIDAPI_KEY = '7d47d18d37msh8a97d59d2102bfbp139a7cjsn19c44ad96a1b';

    const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`ExerciseDB API error: ${response.status} ${response.statusText}`);
    }

    const data: ExerciseDBExercise[] = await response.json();
    return data.slice(0, limit);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Main function to get exercises by body part
 * Tries local database first, falls back to API
 */
export async function getExercisesByBodyPart(
  bodyPart: string, 
  limit: number = 50,
  useLocalDB: boolean = false
): Promise<ExerciseDBExercise[] | LocalExercise[]> {
  try {
    if (useLocalDB) {
      // Try to fetch from local database first
      const localExercises = await getExercisesByBodyPartFromDB(bodyPart, limit);
      if (localExercises.length > 0) {
        return localExercises;
      }
    }

    // Fall back to API
    return await getExercisesByBodyPartFromAPI(bodyPart, limit);
  } catch (error) {
    console.error('Failed to fetch exercises:', error);
    throw error;
  }
}

/**
 * Create the exercises table in Supabase (run this once to set up local storage)
 */
export const createExercisesTableSQL = `
-- Create exercises table for local storage
CREATE TABLE IF NOT EXISTS exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  body_part VARCHAR(100) NOT NULL,
  target VARCHAR(100) NOT NULL,
  equipment VARCHAR(100) NOT NULL,
  gif_url TEXT,
  video_url TEXT,
  instructions TEXT[],
  secondary_muscles TEXT[],
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exercises_body_part ON exercises (body_part);
CREATE INDEX IF NOT EXISTS idx_exercises_target ON exercises (target);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON exercises (equipment);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises (difficulty_level);

-- Enable RLS (Row Level Security)
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to exercises" ON exercises
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update
CREATE POLICY "Allow authenticated users to manage exercises" ON exercises
  FOR ALL USING (auth.role() = 'authenticated');
`;

/**
 * Sync exercises from ExerciseDB API to local database
 * This function can be used to populate the local database
 */
export async function syncExercisesToDatabase(): Promise<void> {
  try {
    const bodyParts = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'abs', 'legs', 'glutes'];
    
    for (const bodyPart of bodyParts) {
      console.log(`Syncing exercises for ${bodyPart}...`);
      
      const exercises = await getExercisesByBodyPartFromAPI(bodyPart, 100);
      
      // Transform API data to local format
      const localExercises = exercises.map(exercise => ({
        name: exercise.name,
        body_part: exercise.bodyPart,
        target: exercise.target,
        equipment: exercise.equipment,
        gif_url: exercise.gifUrl,
        instructions: exercise.instructions,
        secondary_muscles: exercise.secondaryMuscles,
        difficulty_level: 'intermediate' as const, // Default difficulty
      }));

      // Insert into local database
      const { error } = await supabase
        .from('exercises')
        .upsert(localExercises, { 
          onConflict: 'name,body_part', 
          ignoreDuplicates: false 
        });

      if (error) {
        console.error(`Error syncing ${bodyPart} exercises:`, error);
      } else {
        console.log(`Successfully synced ${localExercises.length} exercises for ${bodyPart}`);
      }
    }
  } catch (error) {
    console.error('Error syncing exercises to database:', error);
    throw error;
  }
}
