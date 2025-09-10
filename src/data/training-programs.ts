import { ExerciseWithAttributes } from '../types/exercise';
import { FULL_EXERCISE_DATABASE, getFullExercisesByMuscleGroup } from './full-exercise-database';

export interface TrainingProgram {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  duration: number; // weeks
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  goal: 'STRENGTH' | 'HYPERTROPHY' | 'ENDURANCE' | 'WEIGHT_LOSS' | 'GENERAL_FITNESS';
  frequency: number; // workouts per week
  targetAudience: string;
  targetAudienceEn: string;
  benefits: string[];
  benefitsEn: string[];
  requirements: string[];
  requirementsEn: string[];
  weeks: ProgramWeek[];
  imageUrl?: string;
  color: string;
}

export interface ProgramWeek {
  weekNumber: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  workouts: ProgramWorkout[];
}

export interface ProgramWorkout {
  id: string;
  name: string;
  nameEn: string;
  day: number; // 1-7 (Monday = 1)
  focus: string; // e.g., "Upper Body", "Lower Body", "Full Body"
  duration: number; // minutes
  exercises: ProgramExercise[];
}

export interface ProgramExercise {
  exerciseId: string;
  sets: number;
  reps: string; // e.g., "8-12", "15-20", "3-5"
  restTime: number; // seconds
  notes?: string;
  notesEn?: string;
  progression?: string;
  progressionEn?: string;
}

// PRE-DESIGNED TRAINING PROGRAMS
export const TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    id: 'beginner-full-body',
    name: 'Programme Débutant Corps Complet',
    nameEn: 'Beginner Full Body Program',
    description: 'Un programme parfait pour commencer votre parcours fitness avec des exercices de base et une progression douce.',
    descriptionEn: 'Perfect program to start your fitness journey with basic exercises and gentle progression.',
    duration: 4,
    difficulty: 'BEGINNER',
    goal: 'GENERAL_FITNESS',
    frequency: 3,
    targetAudience: 'Débutants absolus, personnes qui reprennent le sport après une pause',
    targetAudienceEn: 'Complete beginners, people returning to fitness after a break',
    benefits: [
      'Amélioration de la force générale',
      'Développement de la coordination',
      'Renforcement des bases musculaires',
      'Habitudes d\'entraînement durables'
    ],
    benefitsEn: [
      'Improved overall strength',
      'Better coordination development',
      'Stronger muscle foundations',
      'Sustainable training habits'
    ],
    requirements: [
      'Aucune expérience requise',
      'Accès à des haltères ou poids du corps',
      '3 séances par semaine',
      'Motivation pour 4 semaines'
    ],
    requirementsEn: [
      'No experience required',
      'Access to dumbbells or bodyweight',
      '3 sessions per week',
      'Motivation for 4 weeks'
    ],
    color: '#10B981', // Green
    weeks: [
      {
        weekNumber: 1,
        name: 'Semaine 1: Introduction',
        nameEn: 'Week 1: Introduction',
        description: 'Apprentissage des mouvements de base et adaptation du corps.',
        descriptionEn: 'Learning basic movements and body adaptation.',
        workouts: [
          {
            id: 'beginner-day1',
            name: 'Entraînement Corps Complet A',
            nameEn: 'Full Body Workout A',
            day: 1, // Monday
            focus: 'Full Body',
            duration: 45,
            exercises: [
              { exerciseId: '1', sets: 3, reps: '8-12', restTime: 60, notes: 'Concentrez-vous sur la forme' },
              { exerciseId: '2', sets: 3, reps: '8-12', restTime: 60, notes: 'Contrôlez le mouvement' },
              { exerciseId: '3', sets: 3, reps: '10-15', restTime: 45, notes: 'Gardez le corps aligné' },
              { exerciseId: '76', sets: 3, reps: '30-45 sec', restTime: 60, notes: 'Maintenez la position' },
              { exerciseId: '91', sets: 3, reps: '8-12', restTime: 60, notes: 'Descendez lentement' }
            ]
          },
          {
            id: 'beginner-day2',
            name: 'Entraînement Corps Complet B',
            nameEn: 'Full Body Workout B',
            day: 3, // Wednesday
            focus: 'Full Body',
            duration: 45,
            exercises: [
              { exerciseId: '16', sets: 3, reps: '8-12', restTime: 60, notes: 'Contrôlez la descente' },
              { exerciseId: '31', sets: 3, reps: '5-8', restTime: 90, notes: 'Utilisez une assistance si nécessaire' },
              { exerciseId: '46', sets: 3, reps: '10-15', restTime: 60, notes: 'Contraction lente' },
              { exerciseId: '61', sets: 3, reps: '8-12', restTime: 60, notes: 'Gardez les coudes serrés' },
              { exerciseId: '106', sets: 3, reps: '12-15', restTime: 45, notes: 'Squeeze les fessiers' }
            ]
          },
          {
            id: 'beginner-day3',
            name: 'Entraînement Corps Complet C',
            nameEn: 'Full Body Workout C',
            day: 5, // Friday
            focus: 'Full Body',
            duration: 45,
            exercises: [
              { exerciseId: '4', sets: 3, reps: '8-12', restTime: 60, notes: 'Angle de 30-45 degrés' },
              { exerciseId: '32', sets: 3, reps: '8-12', restTime: 60, notes: 'Gardez le dos droit' },
              { exerciseId: '47', sets: 3, reps: '10-15', restTime: 60, notes: 'Contraction au sommet' },
              { exerciseId: '77', sets: 3, reps: '15-20', restTime: 45, notes: 'Contrôlez le mouvement' },
              { exerciseId: '92', sets: 3, reps: '10-15', restTime: 60, notes: 'Profondeur contrôlée' }
            ]
          }
        ]
      },
      {
        weekNumber: 2,
        name: 'Semaine 2: Progression',
        nameEn: 'Week 2: Progression',
        description: 'Augmentation légère de l\'intensité et des répétitions.',
        descriptionEn: 'Slight increase in intensity and repetitions.',
        workouts: [
          {
            id: 'beginner-day1-w2',
            name: 'Entraînement Corps Complet A',
            nameEn: 'Full Body Workout A',
            day: 1,
            focus: 'Full Body',
            duration: 50,
            exercises: [
              { exerciseId: '1', sets: 3, reps: '10-15', restTime: 60, notes: 'Augmentez légèrement le poids' },
              { exerciseId: '2', sets: 3, reps: '10-15', restTime: 60, notes: 'Contrôlez le mouvement' },
              { exerciseId: '3', sets: 3, reps: '12-18', restTime: 45, notes: 'Gardez le corps aligné' },
              { exerciseId: '76', sets: 3, reps: '45-60 sec', restTime: 60, notes: 'Maintenez la position' },
              { exerciseId: '91', sets: 3, reps: '10-15', restTime: 60, notes: 'Descendez lentement' }
            ]
          },
          {
            id: 'beginner-day2-w2',
            name: 'Entraînement Corps Complet B',
            nameEn: 'Full Body Workout B',
            day: 3,
            focus: 'Full Body',
            duration: 50,
            exercises: [
              { exerciseId: '16', sets: 3, reps: '10-15', restTime: 60, notes: 'Contrôlez la descente' },
              { exerciseId: '31', sets: 3, reps: '6-10', restTime: 90, notes: 'Utilisez une assistance si nécessaire' },
              { exerciseId: '46', sets: 3, reps: '12-18', restTime: 60, notes: 'Contraction lente' },
              { exerciseId: '61', sets: 3, reps: '10-15', restTime: 60, notes: 'Gardez les coudes serrés' },
              { exerciseId: '106', sets: 3, reps: '15-20', restTime: 45, notes: 'Squeeze les fessiers' }
            ]
          },
          {
            id: 'beginner-day3-w2',
            name: 'Entraînement Corps Complet C',
            nameEn: 'Full Body Workout C',
            day: 5,
            focus: 'Full Body',
            duration: 50,
            exercises: [
              { exerciseId: '4', sets: 3, reps: '10-15', restTime: 60, notes: 'Angle de 30-45 degrés' },
              { exerciseId: '32', sets: 3, reps: '10-15', restTime: 60, notes: 'Gardez le dos droit' },
              { exerciseId: '47', sets: 3, reps: '12-18', restTime: 60, notes: 'Contraction au sommet' },
              { exerciseId: '77', sets: 3, reps: '18-25', restTime: 45, notes: 'Contrôlez le mouvement' },
              { exerciseId: '92', sets: 3, reps: '12-18', restTime: 60, notes: 'Profondeur contrôlée' }
            ]
          }
        ]
      }
      // Weeks 3 and 4 would follow similar pattern with progressive overload
    ]
  },
  {
    id: 'intermediate-upper-lower',
    name: 'Programme Intermédiaire Haut/Bas',
    nameEn: 'Intermediate Upper/Lower Split',
    description: 'Programme de 6 semaines pour développer la force et la masse musculaire avec une séparation haut/bas du corps.',
    descriptionEn: '6-week program to develop strength and muscle mass with upper/lower body split.',
    duration: 6,
    difficulty: 'INTERMEDIATE',
    goal: 'HYPERTROPHY',
    frequency: 4,
    targetAudience: 'Personnes avec 3-6 mois d\'expérience en musculation',
    targetAudienceEn: 'People with 3-6 months of weightlifting experience',
    benefits: [
      'Développement musculaire ciblé',
      'Amélioration de la force',
      'Récupération optimisée',
      'Progression structurée'
    ],
    benefitsEn: [
      'Targeted muscle development',
      'Improved strength',
      'Optimized recovery',
      'Structured progression'
    ],
    requirements: [
      'Expérience de base en musculation',
      'Accès à une salle de sport complète',
      '4 séances par semaine',
      'Engagement pour 6 semaines'
    ],
    requirementsEn: [
      'Basic weightlifting experience',
      'Access to complete gym',
      '4 sessions per week',
      'Commitment for 6 weeks'
    ],
    color: '#3B82F6', // Blue
    weeks: [
      {
        weekNumber: 1,
        name: 'Semaine 1: Adaptation',
        nameEn: 'Week 1: Adaptation',
        description: 'Adaptation au nouveau volume d\'entraînement.',
        descriptionEn: 'Adaptation to new training volume.',
        workouts: [
          {
            id: 'intermediate-upper1',
            name: 'Haut du Corps A',
            nameEn: 'Upper Body A',
            day: 1, // Monday
            focus: 'Upper Body',
            duration: 60,
            exercises: [
              { exerciseId: '1', sets: 4, reps: '6-8', restTime: 120, notes: 'Charge lourde, forme parfaite' },
              { exerciseId: '16', sets: 3, reps: '8-10', restTime: 90, notes: 'Contrôle complet' },
              { exerciseId: '31', sets: 3, reps: '6-8', restTime: 120, notes: 'Charge progressive' },
              { exerciseId: '46', sets: 3, reps: '10-12', restTime: 60, notes: 'Contraction maximale' },
              { exerciseId: '61', sets: 3, reps: '8-10', restTime: 90, notes: 'Extension complète' }
            ]
          },
          {
            id: 'intermediate-lower1',
            name: 'Bas du Corps A',
            nameEn: 'Lower Body A',
            day: 2, // Tuesday
            focus: 'Lower Body',
            duration: 60,
            exercises: [
              { exerciseId: '95', sets: 4, reps: '6-8', restTime: 120, notes: 'Charge lourde' },
              { exerciseId: '92', sets: 3, reps: '8-10', restTime: 90, notes: 'Profondeur complète' },
              { exerciseId: '106', sets: 3, reps: '12-15', restTime: 60, notes: 'Contraction fessiers' },
              { exerciseId: '93', sets: 3, reps: '8-10', restTime: 90, notes: 'Équilibre et contrôle' },
              { exerciseId: '91', sets: 3, reps: '15-20', restTime: 60, notes: 'Endurance musculaire' }
            ]
          },
          {
            id: 'intermediate-upper2',
            name: 'Haut du Corps B',
            nameEn: 'Upper Body B',
            day: 4, // Thursday
            focus: 'Upper Body',
            duration: 60,
            exercises: [
              { exerciseId: '4', sets: 4, reps: '6-8', restTime: 120, notes: 'Angle incliné' },
              { exerciseId: '32', sets: 3, reps: '8-10', restTime: 90, notes: 'Contraction scapulaire' },
              { exerciseId: '17', sets: 3, reps: '10-12', restTime: 60, notes: 'Contrôle de la descente' },
              { exerciseId: '47', sets: 3, reps: '12-15', restTime: 60, notes: 'Contraction maximale' },
              { exerciseId: '62', sets: 3, reps: '10-12', restTime: 90, notes: 'Extension complète' }
            ]
          },
          {
            id: 'intermediate-lower2',
            name: 'Bas du Corps B',
            nameEn: 'Lower Body B',
            day: 5, // Friday
            focus: 'Lower Body',
            duration: 60,
            exercises: [
              { exerciseId: '97', sets: 4, reps: '6-8', restTime: 120, notes: 'Charge lourde' },
              { exerciseId: '94', sets: 3, reps: '8-10', restTime: 90, notes: 'Contrôle unilatéral' },
              { exerciseId: '107', sets: 3, reps: '12-15', restTime: 60, notes: 'Contraction fessiers' },
              { exerciseId: '108', sets: 3, reps: '10-12', restTime: 90, notes: 'Équilibre et contrôle' },
              { exerciseId: '92', sets: 3, reps: '15-20', restTime: 60, notes: 'Endurance musculaire' }
            ]
          }
        ]
      }
      // Additional weeks would follow with progressive overload
    ]
  },
  {
    id: 'advanced-push-pull-legs',
    name: 'Programme Avancé Push/Pull/Legs',
    nameEn: 'Advanced Push/Pull/Legs Program',
    description: 'Programme avancé de 8 semaines avec séparation push/pull/legs pour maximiser le développement musculaire.',
    descriptionEn: 'Advanced 8-week program with push/pull/legs split to maximize muscle development.',
    duration: 8,
    difficulty: 'ADVANCED',
    goal: 'STRENGTH',
    frequency: 6,
    targetAudience: 'Athlètes expérimentés avec 1+ an d\'expérience',
    targetAudienceEn: 'Experienced athletes with 1+ year of experience',
    benefits: [
      'Développement musculaire maximal',
      'Force explosive',
      'Récupération optimisée',
      'Performance athlétique'
    ],
    benefitsEn: [
      'Maximal muscle development',
      'Explosive strength',
      'Optimized recovery',
      'Athletic performance'
    ],
    requirements: [
      'Expérience avancée en musculation',
      'Accès à une salle de sport complète',
      '6 séances par semaine',
      'Engagement pour 8 semaines',
      'Connaissance des techniques avancées'
    ],
    requirementsEn: [
      'Advanced weightlifting experience',
      'Access to complete gym',
      '6 sessions per week',
      'Commitment for 8 weeks',
      'Knowledge of advanced techniques'
    ],
    color: '#EF4444', // Red
    weeks: [
      {
        weekNumber: 1,
        name: 'Semaine 1: Intensification',
        nameEn: 'Week 1: Intensification',
        description: 'Augmentation de l\'intensité et du volume d\'entraînement.',
        descriptionEn: 'Increase in training intensity and volume.',
        workouts: [
          {
            id: 'advanced-push1',
            name: 'Push Day A',
            nameEn: 'Push Day A',
            day: 1, // Monday
            focus: 'Push (Chest, Shoulders, Triceps)',
            duration: 75,
            exercises: [
              { exerciseId: '1', sets: 5, reps: '3-5', restTime: 180, notes: 'Charge maximale' },
              { exerciseId: '16', sets: 4, reps: '6-8', restTime: 120, notes: 'Force explosive' },
              { exerciseId: '4', sets: 4, reps: '8-10', restTime: 90, notes: 'Contrôle parfait' },
              { exerciseId: '17', sets: 3, reps: '10-12', restTime: 60, notes: 'Contraction maximale' },
              { exerciseId: '61', sets: 4, reps: '8-10', restTime: 90, notes: 'Extension complète' },
              { exerciseId: '62', sets: 3, reps: '12-15', restTime: 60, notes: 'Finition triceps' }
            ]
          },
          {
            id: 'advanced-pull1',
            name: 'Pull Day A',
            nameEn: 'Pull Day A',
            day: 2, // Tuesday
            focus: 'Pull (Back, Biceps)',
            duration: 75,
            exercises: [
              { exerciseId: '31', sets: 5, reps: '3-5', restTime: 180, notes: 'Charge maximale' },
              { exerciseId: '32', sets: 4, reps: '6-8', restTime: 120, notes: 'Contraction scapulaire' },
              { exerciseId: '33', sets: 4, reps: '8-10', restTime: 90, notes: 'Contrôle parfait' },
              { exerciseId: '34', sets: 3, reps: '10-12', restTime: 60, notes: 'Contraction maximale' },
              { exerciseId: '46', sets: 4, reps: '8-10', restTime: 90, notes: 'Contraction lente' },
              { exerciseId: '47', sets: 3, reps: '12-15', restTime: 60, notes: 'Finition biceps' }
            ]
          },
          {
            id: 'advanced-legs1',
            name: 'Legs Day A',
            nameEn: 'Legs Day A',
            day: 3, // Wednesday
            focus: 'Legs (Quads, Hamstrings, Glutes)',
            duration: 75,
            exercises: [
              { exerciseId: '95', sets: 5, reps: '3-5', restTime: 180, notes: 'Charge maximale' },
              { exerciseId: '97', sets: 4, reps: '6-8', restTime: 120, notes: 'Force explosive' },
              { exerciseId: '93', sets: 4, reps: '8-10', restTime: 90, notes: 'Contrôle unilatéral' },
              { exerciseId: '106', sets: 3, reps: '12-15', restTime: 60, notes: 'Contraction fessiers' },
              { exerciseId: '92', sets: 3, reps: '15-20', restTime: 60, notes: 'Endurance musculaire' }
            ]
          }
          // Additional days would follow the same pattern
        ]
      }
      // Additional weeks would follow with progressive overload
    ]
  }
];

// Helper functions
export function getTrainingPrograms(): TrainingProgram[] {
  return TRAINING_PROGRAMS;
}

export function getTrainingProgramById(id: string): TrainingProgram | undefined {
  return TRAINING_PROGRAMS.find(program => program.id === id);
}

export function getTrainingProgramsByDifficulty(difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'): TrainingProgram[] {
  return TRAINING_PROGRAMS.filter(program => program.difficulty === difficulty);
}

export function getTrainingProgramsByGoal(goal: 'STRENGTH' | 'HYPERTROPHY' | 'ENDURANCE' | 'WEIGHT_LOSS' | 'GENERAL_FITNESS'): TrainingProgram[] {
  return TRAINING_PROGRAMS.filter(program => program.goal === goal);
}

export function getProgramExerciseDetails(exerciseId: string): ExerciseWithAttributes | undefined {
  return FULL_EXERCISE_DATABASE.find(exercise => exercise.id === exerciseId);
}
