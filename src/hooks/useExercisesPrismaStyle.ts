import { useState, useEffect, useCallback } from 'react';
import { 
  getExercisesByBodyPart, 
  getExercisesByTarget, 
  getExercisesByEquipment,
  getExercisesByDifficulty,
  searchExercises,
  getExercisesWithPagination,
  ExerciseService
} from '@/lib/api/exercises.prisma-style';
import { LocalExercise } from '@/lib/api/exercises.getByBodyPart';

interface UseExercisesOptions {
  bodyPart?: string;
  target?: string;
  equipment?: string;
  difficulty?: string;
  searchTerm?: string;
  limit?: number;
  enabled?: boolean;
}

interface UseExercisesReturn {
  exercises: LocalExercise[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook using Prisma-style API for exercises
 */
export function useExercises({
  bodyPart,
  target,
  equipment,
  difficulty,
  searchTerm,
  limit = 50,
  enabled = true
}: UseExercisesOptions): UseExercisesReturn {
  const [exercises, setExercises] = useState<LocalExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      let data: LocalExercise[] = [];

      if (searchTerm) {
        data = await searchExercises(searchTerm, limit);
      } else if (bodyPart) {
        data = await getExercisesByBodyPart(bodyPart, limit);
      } else if (target) {
        data = await getExercisesByTarget(target, limit);
      } else if (equipment) {
        data = await getExercisesByEquipment(equipment, limit);
      } else if (difficulty) {
        data = await getExercisesByDifficulty(difficulty, limit);
      } else {
        // Get all exercises if no filters
        data = await ExerciseService.findMany({ take: limit });
      }

      setExercises(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exercises';
      setError(errorMessage);
      console.error('Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  }, [bodyPart, target, equipment, difficulty, searchTerm, limit, enabled]);

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

interface UseExercisesPaginationOptions {
  page?: number;
  pageSize?: number;
  filters?: {
    body_part?: string;
    target?: string;
    equipment?: string;
    difficulty_level?: string;
  };
  enabled?: boolean;
}

interface UseExercisesPaginationReturn {
  exercises: LocalExercise[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

/**
 * Hook for paginated exercises using Prisma-style API
 */
export function useExercisesPagination({
  page = 1,
  pageSize = 20,
  filters = {},
  enabled = true
}: UseExercisesPaginationOptions): UseExercisesPaginationReturn {
  const [data, setData] = useState<{
    exercises: LocalExercise[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>({
    exercises: [],
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getExercisesWithPagination(page, pageSize, filters);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exercises';
      setError(errorMessage);
      console.error('Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters, enabled]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= data.totalPages) {
      setData(prev => ({ ...prev, page: newPage }));
    }
  }, [data.totalPages]);

  const nextPage = useCallback(() => {
    goToPage(data.page + 1);
  }, [data.page, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(data.page - 1);
  }, [data.page, goToPage]);

  return {
    ...data,
    loading,
    error,
    refetch: fetchExercises,
    goToPage,
    nextPage,
    prevPage
  };
}

/**
 * Hook for exercise CRUD operations using Prisma-style API
 */
export function useExerciseCRUD() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createExercise = useCallback(async (data: Omit<LocalExercise, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);

    try {
      const result = await ExerciseService.create(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create exercise';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExercise = useCallback(async (id: string, data: Partial<Omit<LocalExercise, 'id' | 'created_at' | 'updated_at'>>) => {
    setLoading(true);
    setError(null);

    try {
      const result = await ExerciseService.update({ id }, data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update exercise';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteExercise = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await ExerciseService.delete({ id });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete exercise';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getExercise = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await ExerciseService.findUnique({ id });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get exercise';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createExercise,
    updateExercise,
    deleteExercise,
    getExercise,
    loading,
    error
  };
}
