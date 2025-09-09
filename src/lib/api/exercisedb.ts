const RAPIDAPI_HOST = 'exercisedb.p.rapidapi.com';
const RAPIDAPI_KEY = '7d47d18d37msh8a97d59d2102bfbp139a7cjsn19c44ad96a1b';

export interface ExerciseDBExercise {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

export interface ExerciseDBTarget {
  name: string;
  count: number;
}

// Fallback sample data for when API is rate limited
const FALLBACK_EXERCISES: ExerciseDBExercise[] = [
  {
    id: '1',
    name: 'Push-ups',
    bodyPart: 'chest',
    equipment: 'body weight',
    gifUrl: 'https://v2.exercisedb.io/image/1',
    target: 'pectorals',
    secondaryMuscles: ['anterior deltoid', 'triceps'],
    instructions: [
      'Start in a plank position with your hands slightly wider than shoulder-width apart.',
      'Lower your body until your chest nearly touches the floor.',
      'Push back up to the starting position.',
      'Keep your core tight and maintain a straight line from head to heels.'
    ]
  },
  {
    id: '2',
    name: 'Pull-ups',
    bodyPart: 'back',
    equipment: 'body weight',
    gifUrl: 'https://v2.exercisedb.io/image/2',
    target: 'lats',
    secondaryMuscles: ['biceps', 'rhomboids'],
    instructions: [
      'Hang from a pull-up bar with your palms facing away from you.',
      'Pull your body up until your chin clears the bar.',
      'Lower yourself back down with control.',
      'Keep your core engaged throughout the movement.'
    ]
  },
  {
    id: '3',
    name: 'Squats',
    bodyPart: 'upper legs',
    equipment: 'body weight',
    gifUrl: 'https://v2.exercisedb.io/image/3',
    target: 'quadriceps',
    secondaryMuscles: ['glutes', 'hamstrings'],
    instructions: [
      'Stand with your feet shoulder-width apart.',
      'Lower your body as if sitting back into a chair.',
      'Keep your chest up and knees behind your toes.',
      'Return to standing position by pushing through your heels.'
    ]
  }
];

const FALLBACK_TARGETS: ExerciseDBTarget[] = [
  { name: 'chest', count: 15 },
  { name: 'back', count: 20 },
  { name: 'shoulders', count: 12 },
  { name: 'biceps', count: 8 },
  { name: 'triceps', count: 10 },
  { name: 'abs', count: 25 },
  { name: 'legs', count: 18 },
  { name: 'glutes', count: 14 }
];

class ExerciseDBService {
  private baseUrl = 'https://exercisedb.p.rapidapi.com';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly RATE_LIMIT_DELAY = 1000; // 1 second between requests
  private rateLimited = false;
  private rateLimitResetTime = 0;
  
  private async makeRequest(endpoint: string) {
    // Check cache first
    const cached = this.cache.get(endpoint);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`Using cached data for ${endpoint}`);
      return cached.data;
    }

    // If we're rate limited, check if we can retry
    if (this.rateLimited) {
      if (Date.now() > this.rateLimitResetTime) {
        console.log('Rate limit reset, retrying API calls');
        this.rateLimited = false;
      } else {
        console.log('Using fallback data due to rate limiting');
        return this.getFallbackData(endpoint);
      }
    }

    // Add to queue to respect rate limits
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: {
              'x-rapidapi-host': RAPIDAPI_HOST,
              'x-rapidapi-key': RAPIDAPI_KEY,
            },
          });

          if (response.status === 429) {
            console.warn('Rate limit hit, switching to fallback data');
            this.rateLimited = true;
            this.rateLimitResetTime = Date.now() + (10 * 60 * 1000); // Reset after 10 minutes
            const fallbackData = this.getFallbackData(endpoint);
            resolve(fallbackData);
            return;
          }

          if (!response.ok) {
            throw new Error(`ExerciseDB API error: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          
          // Cache the result
          this.cache.set(endpoint, { data, timestamp: Date.now() });
          
          resolve(data);
        } catch (error) {
          console.error('API request failed, using fallback data:', error);
          const fallbackData = this.getFallbackData(endpoint);
          resolve(fallbackData);
        }
      });

      this.processQueue();
    });
  }

  private getFallbackData(endpoint: string): any {
    if (endpoint.includes('/targetList')) {
      return FALLBACK_TARGETS;
    }
    if (endpoint.includes('/bodyPart/')) {
      return FALLBACK_EXERCISES;
    }
    if (endpoint.includes('/exercises/target/')) {
      return FALLBACK_EXERCISES;
    }
    return [];
  }

  private async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('Request failed:', error);
        }
        
        // Wait between requests to respect rate limits
        if (this.requestQueue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, this.RATE_LIMIT_DELAY));
        }
      }
    }

    this.isProcessingQueue = false;
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

  // Get exercises by target muscle group
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

  // Get all exercises
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
      const data = await this.makeRequest(`/exercises?name=${encodeURIComponent(query)}`);
      return data;
    } catch (error) {
      console.error(`Error searching exercises for "${query}":`, error);
      throw error;
    }
  }
}

export const exerciseDBService = new ExerciseDBService();