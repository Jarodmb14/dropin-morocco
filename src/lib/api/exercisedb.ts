// ExerciseDB API service
const RAPIDAPI_KEY = '7d47d18d37msh8a97d59d2102bfbp139a7cjsn19c44ad96a1b';
const RAPIDAPI_HOST = 'exercisedb.p.rapidapi.com';

export interface ExerciseDBExercise {
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  id: string;
  name: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

export interface ExerciseDBTarget {
  name: string;
  count: number;
}

class ExerciseDBService {
  private baseUrl = 'https://exercisedb.p.rapidapi.com';
  
  private async makeRequest(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`ExerciseDB API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get all available target muscle groups
  async getTargetList(): Promise<ExerciseDBTarget[]> {
    try {
      const data = await this.makeRequest('/exercises/targetList');
      return data;
    } catch (error) {
      console.error('Error fetching target list:', error);
      throw error;
    }
  }

  // Get all available body parts
  async getBodyPartList(): Promise<string[]> {
    try {
      const data = await this.makeRequest('/exercises/bodyPartList');
      return data;
    } catch (error) {
      console.error('Error fetching body part list:', error);
      throw error;
    }
  }

  // Get all available equipment
  async getEquipmentList(): Promise<string[]> {
    try {
      const data = await this.makeRequest('/exercises/equipmentList');
      return data;
    } catch (error) {
      console.error('Error fetching equipment list:', error);
      throw error;
    }
  }

  // Get exercises by body part
  async getExercisesByBodyPart(bodyPart: string): Promise<ExerciseDBExercise[]> {
    try {
      const data = await this.makeRequest(`/exercises/bodyPart/${bodyPart}`);
      return data;
    } catch (error) {
      console.error(`Error fetching exercises for body part ${bodyPart}:`, error);
      throw error;
    }
  }

  // Get exercises by target muscle
  async getExercisesByTarget(target: string): Promise<ExerciseDBExercise[]> {
    try {
      // Map our target names to body part names that the API recognizes
      const targetToBodyPart: Record<string, string> = {
        'back': 'back',
        'chest': 'chest',
        'shoulders': 'shoulders',
        'biceps': 'upper arms',
        'triceps': 'upper arms',
        'abs': 'waist',
        'legs': 'upper legs',
        'glutes': 'upper legs',
        'upper arms': 'upper arms',
        'lower arms': 'lower arms',
        'upper legs': 'upper legs',
        'lower legs': 'lower legs',
        'waist': 'waist',
        'neck': 'neck'
      };

      const bodyPart = targetToBodyPart[target.toLowerCase()] || target.toLowerCase();
      console.log(`Fetching exercises for target "${target}" using body part "${bodyPart}"`);
      
      const data = await this.makeRequest(`/exercises/bodyPart/${bodyPart}`);
      return data;
    } catch (error) {
      console.error(`Error fetching exercises for target ${target}:`, error);
      throw error;
    }
  }

  // Get exercises by equipment
  async getExercisesByEquipment(equipment: string): Promise<ExerciseDBExercise[]> {
    try {
      const data = await this.makeRequest(`/exercises/equipment/${equipment}`);
      return data;
    } catch (error) {
      console.error(`Error fetching exercises for equipment ${equipment}:`, error);
      throw error;
    }
  }

  // Get all exercises (be careful with this one - it's a lot of data)
  async getAllExercises(): Promise<ExerciseDBExercise[]> {
    try {
      const data = await this.makeRequest('/exercises');
      return data;
    } catch (error) {
      console.error('Error fetching all exercises:', error);
      throw error;
    }
  }

  // Search exercises by name
  async searchExercises(query: string): Promise<ExerciseDBExercise[]> {
    try {
      const data = await this.makeRequest(`/exercises/name/${query}`);
      return data;
    } catch (error) {
      console.error(`Error searching exercises for "${query}":`, error);
      throw error;
    }
  }
}

export const exerciseDBService = new ExerciseDBService();
