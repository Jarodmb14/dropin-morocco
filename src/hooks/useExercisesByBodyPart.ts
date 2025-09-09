import { useState, useEffect, useCallback } from 'react';
import { getExercisesByBodyPart, LocalExercise } from '@/lib/api/exercises.getByBodyPart';
import { ExerciseDBExercise } from '@/lib/api/exercisedb';

interface UseExercisesByBodyPartOptions {
  bodyPart: string;
  limit?: number;
  useLocalDB?: boolean;
  enabled?: boolean;
}

interface UseExercisesByBodyPartReturn {
  exercises: ExerciseDBExercise[] | LocalExercise[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch exercises by body part
 * Supports both local database and external API
 */
export function useExercisesByBodyPart({
  bodyPart,
  limit = 50,
  useLocalDB = false,
  enabled = true
}: UseExercisesByBodyPartOptions): UseExercisesByBodyPartReturn {
  const [exercises, setExercises] = useState<ExerciseDBExercise[] | LocalExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    if (!enabled || !bodyPart) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getExercisesByBodyPart(bodyPart, limit, useLocalDB);
      setExercises(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exercises';
      setError(errorMessage);
      console.error('Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  }, [bodyPart, limit, useLocalDB, enabled]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return {
    exercises,
    loading,
    error,
    refetch: fetchExercises
  };
}

/**
 * Hook specifically for ExerciseDB API (current implementation)
 */
export function useExerciseDBByBodyPart(bodyPart: string, limit: number = 50) {
  return useExercisesByBodyPart({
    bodyPart,
    limit,
    useLocalDB: false,
    enabled: !!bodyPart
  });
}

/**
 * Hook specifically for local database
 */
export function useLocalExercisesByBodyPart(bodyPart: string, limit: number = 50) {
  return useExercisesByBodyPart({
    bodyPart,
    limit,
    useLocalDB: true,
    enabled: !!bodyPart
  });
}
