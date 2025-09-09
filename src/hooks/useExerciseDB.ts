import { useState, useEffect } from 'react';
import { exerciseDBService, ExerciseDBExercise, ExerciseDBTarget } from '@/lib/api/exercisedb';

export const useExerciseDB = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWithLoading = async <T>(fetchFn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('ExerciseDB API error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    clearError: () => setError(null),
    
    // Target muscle groups
    getTargetList: () => fetchWithLoading(() => exerciseDBService.getTargetList()),
    
    // Body parts
    getBodyPartList: () => fetchWithLoading(() => exerciseDBService.getBodyPartList()),
    
    // Equipment
    getEquipmentList: () => fetchWithLoading(() => exerciseDBService.getEquipmentList()),
    
    // Exercises by body part
    getExercisesByBodyPart: (bodyPart: string) => 
      fetchWithLoading(() => exerciseDBService.getExercisesByBodyPart(bodyPart)),
    
    // Exercises by target muscle
    getExercisesByTarget: (target: string) => 
      fetchWithLoading(() => exerciseDBService.getExercisesByTarget(target)),
    
    // Exercises by equipment
    getExercisesByEquipment: (equipment: string) => 
      fetchWithLoading(() => exerciseDBService.getExercisesByEquipment(equipment)),
    
    // All exercises
    getAllExercises: () => fetchWithLoading(() => exerciseDBService.getAllExercises()),
    
    // Search exercises
    searchExercises: (query: string) => 
      fetchWithLoading(() => exerciseDBService.searchExercises(query)),
  };
};

// Hook for managing exercise data with caching
export const useExerciseData = () => {
  const [exercises, setExercises] = useState<ExerciseDBExercise[]>([]);
  const [targets, setTargets] = useState<ExerciseDBTarget[]>([]);
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { 
    getTargetList, 
    getBodyPartList, 
    getEquipmentList, 
    getExercisesByBodyPart,
    getExercisesByTarget,
    loading: apiLoading,
    error: apiError
  } = useExerciseDB();

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [targetsData, bodyPartsData, equipmentData] = await Promise.all([
          getTargetList(),
          getBodyPartList(),
          getEquipmentList(),
        ]);

        if (targetsData) setTargets(targetsData);
        if (bodyPartsData) setBodyParts(bodyPartsData);
        if (equipmentData) setEquipment(equipmentData);
      } catch (err) {
        setError(apiError || 'Failed to load exercise data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const loadExercisesByBodyPart = async (bodyPart: string) => {
    const data = await getExercisesByBodyPart(bodyPart);
    if (data) {
      setExercises(data);
    }
    return data;
  };

  const loadExercisesByTarget = async (target: string) => {
    const data = await getExercisesByTarget(target);
    if (data) {
      setExercises(data);
    }
    return data;
  };

  return {
    exercises,
    targets,
    bodyParts,
    equipment,
    loading: loading || apiLoading,
    error: error || apiError,
    loadExercisesByBodyPart,
    loadExercisesByTarget,
    clearError: () => setError(null),
  };
};
