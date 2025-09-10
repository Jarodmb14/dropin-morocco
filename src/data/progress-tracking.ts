import { supabase } from '@/integrations/supabase/client';

export interface WorkoutSession {
  id: string;
  userId: string;
  programId?: string;
  workoutId?: string;
  date: string;
  duration: number; // minutes
  exercises: WorkoutExercise[];
  notes?: string;
  rating?: number; // 1-5
  createdAt: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: ExerciseSet[];
  notes?: string;
}

export interface ExerciseSet {
  setNumber: number;
  reps: number;
  weight?: number; // kg
  duration?: number; // seconds for time-based exercises
  distance?: number; // meters for cardio
  restTime?: number; // seconds
  completed: boolean;
  notes?: string;
}

export interface PersonalRecord {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  recordType: 'MAX_WEIGHT' | 'MAX_REPS' | 'BEST_TIME' | 'MAX_DISTANCE';
  value: number;
  date: string;
  workoutId: string;
}

export interface ProgressMetrics {
  totalWorkouts: number;
  totalDuration: number; // minutes
  averageWorkoutDuration: number;
  currentStreak: number; // days
  longestStreak: number; // days
  favoriteExercise: string;
  mostImprovedExercise: string;
  weeklyProgress: WeeklyProgress[];
  monthlyProgress: MonthlyProgress[];
}

export interface WeeklyProgress {
  week: string; // YYYY-WW format
  workouts: number;
  duration: number;
  exercises: number;
  personalRecords: number;
}

export interface MonthlyProgress {
  month: string; // YYYY-MM format
  workouts: number;
  duration: number;
  exercises: number;
  personalRecords: number;
  averageRating: number;
}

// Progress Tracking Functions
export class ProgressTracker {
  // Save a completed workout session
  static async saveWorkoutSession(session: Omit<WorkoutSession, 'id' | 'createdAt'>): Promise<WorkoutSession> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .insert([{
        user_id: session.userId,
        program_id: session.programId,
        workout_id: session.workoutId,
        date: session.date,
        duration: session.duration,
        exercises: session.exercises,
        notes: session.notes,
        rating: session.rating
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving workout session:', error);
      throw error;
    }

    return {
      id: data.id,
      userId: data.user_id,
      programId: data.program_id,
      workoutId: data.workout_id,
      date: data.date,
      duration: data.duration,
      exercises: data.exercises,
      notes: data.notes,
      rating: data.rating,
      createdAt: data.created_at
    };
  }

  // Get workout history for a user
  static async getWorkoutHistory(userId: string, limit: number = 50): Promise<WorkoutSession[]> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching workout history:', error);
      throw error;
    }

    return data.map(session => ({
      id: session.id,
      userId: session.user_id,
      programId: session.program_id,
      workoutId: session.workout_id,
      date: session.date,
      duration: session.duration,
      exercises: session.exercises,
      notes: session.notes,
      rating: session.rating,
      createdAt: session.created_at
    }));
  }

  // Get personal records for a user
  static async getPersonalRecords(userId: string): Promise<PersonalRecord[]> {
    const { data, error } = await supabase
      .from('personal_records')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching personal records:', error);
      throw error;
    }

    return data.map(record => ({
      id: record.id,
      userId: record.user_id,
      exerciseId: record.exercise_id,
      exerciseName: record.exercise_name,
      recordType: record.record_type,
      value: record.value,
      date: record.date,
      workoutId: record.workout_id
    }));
  }

  // Update personal records after a workout
  static async updatePersonalRecords(userId: string, exercises: WorkoutExercise[], workoutId: string): Promise<void> {
    const records: Omit<PersonalRecord, 'id'>[] = [];

    for (const exercise of exercises) {
      for (const set of exercise.sets) {
        if (!set.completed || !set.weight) continue;

        // Check for new max weight record
        const existingMaxWeight = await supabase
          .from('personal_records')
          .select('value')
          .eq('user_id', userId)
          .eq('exercise_id', exercise.exerciseId)
          .eq('record_type', 'MAX_WEIGHT')
          .order('value', { ascending: false })
          .limit(1)
          .single();

        if (!existingMaxWeight.data || set.weight > existingMaxWeight.data.value) {
          records.push({
            userId,
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.exerciseName,
            recordType: 'MAX_WEIGHT',
            value: set.weight,
            date: new Date().toISOString().split('T')[0],
            workoutId
          });
        }

        // Check for new max reps record
        const existingMaxReps = await supabase
          .from('personal_records')
          .select('value')
          .eq('user_id', userId)
          .eq('exercise_id', exercise.exerciseId)
          .eq('record_type', 'MAX_REPS')
          .order('value', { ascending: false })
          .limit(1)
          .single();

        if (!existingMaxReps.data || set.reps > existingMaxReps.data.value) {
          records.push({
            userId,
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.exerciseName,
            recordType: 'MAX_REPS',
            value: set.reps,
            date: new Date().toISOString().split('T')[0],
            workoutId
          });
        }
      }
    }

    if (records.length > 0) {
      const { error } = await supabase
        .from('personal_records')
        .insert(records.map(record => ({
          user_id: record.userId,
          exercise_id: record.exerciseId,
          exercise_name: record.exerciseName,
          record_type: record.recordType,
          value: record.value,
          date: record.date,
          workout_id: record.workoutId
        })));

      if (error) {
        console.error('Error updating personal records:', error);
        throw error;
      }
    }
  }

  // Calculate progress metrics for a user
  static async getProgressMetrics(userId: string): Promise<ProgressMetrics> {
    const [workoutHistory, personalRecords] = await Promise.all([
      this.getWorkoutHistory(userId, 1000),
      this.getPersonalRecords(userId)
    ]);

    // Calculate basic metrics
    const totalWorkouts = workoutHistory.length;
    const totalDuration = workoutHistory.reduce((sum, workout) => sum + workout.duration, 0);
    const averageWorkoutDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;

    // Calculate streaks
    const { currentStreak, longestStreak } = this.calculateStreaks(workoutHistory);

    // Find favorite exercise
    const exerciseCounts = new Map<string, number>();
    workoutHistory.forEach(workout => {
      workout.exercises.forEach(exercise => {
        const count = exerciseCounts.get(exercise.exerciseName) || 0;
        exerciseCounts.set(exercise.exerciseName, count + 1);
      });
    });
    const favoriteExercise = Array.from(exerciseCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    // Calculate weekly progress
    const weeklyProgress = this.calculateWeeklyProgress(workoutHistory);

    // Calculate monthly progress
    const monthlyProgress = this.calculateMonthlyProgress(workoutHistory);

    return {
      totalWorkouts,
      totalDuration,
      averageWorkoutDuration,
      currentStreak,
      longestStreak,
      favoriteExercise,
      mostImprovedExercise: 'Calculating...', // TODO: Implement improvement calculation
      weeklyProgress,
      monthlyProgress
    };
  }

  // Calculate workout streaks
  private static calculateStreaks(workoutHistory: WorkoutSession[]): { currentStreak: number; longestStreak: number } {
    if (workoutHistory.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const workoutDates = workoutHistory
      .map(workout => new Date(workout.date))
      .sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < workoutDates.length; i++) {
      const workoutDate = new Date(workoutDates[i]);
      workoutDate.setHours(0, 0, 0, 0);

      if (i === 0) {
        // Check if the most recent workout was today or yesterday
        const daysDiff = Math.floor((today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff <= 1) {
          currentStreak = 1;
        }
      }

      if (i > 0) {
        const prevDate = new Date(workoutDates[i - 1]);
        prevDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((prevDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          tempStreak++;
          if (i === 1 && currentStreak > 0) {
            currentStreak++;
          }
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  }

  // Calculate weekly progress
  private static calculateWeeklyProgress(workoutHistory: WorkoutSession[]): WeeklyProgress[] {
    const weeklyData = new Map<string, { workouts: number; duration: number; exercises: number; personalRecords: number }>();

    workoutHistory.forEach(workout => {
      const date = new Date(workout.date);
      const week = this.getWeekString(date);
      
      const existing = weeklyData.get(week) || { workouts: 0, duration: 0, exercises: 0, personalRecords: 0 };
      existing.workouts++;
      existing.duration += workout.duration;
      existing.exercises += workout.exercises.length;
      
      weeklyData.set(week, existing);
    });

    return Array.from(weeklyData.entries())
      .map(([week, data]) => ({
        week,
        ...data,
        personalRecords: 0 // TODO: Calculate from personal records
      }))
      .sort((a, b) => a.week.localeCompare(b.week));
  }

  // Calculate monthly progress
  private static calculateMonthlyProgress(workoutHistory: WorkoutSession[]): MonthlyProgress[] {
    const monthlyData = new Map<string, { workouts: number; duration: number; exercises: number; personalRecords: number; totalRating: number; ratingCount: number }>();

    workoutHistory.forEach(workout => {
      const date = new Date(workout.date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const existing = monthlyData.get(month) || { workouts: 0, duration: 0, exercises: 0, personalRecords: 0, totalRating: 0, ratingCount: 0 };
      existing.workouts++;
      existing.duration += workout.duration;
      existing.exercises += workout.exercises.length;
      
      if (workout.rating) {
        existing.totalRating += workout.rating;
        existing.ratingCount++;
      }
      
      monthlyData.set(month, existing);
    });

    return Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        workouts: data.workouts,
        duration: data.duration,
        exercises: data.exercises,
        personalRecords: 0, // TODO: Calculate from personal records
        averageRating: data.ratingCount > 0 ? data.totalRating / data.ratingCount : 0
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  // Helper function to get week string
  private static getWeekString(date: Date): string {
    const year = date.getFullYear();
    const week = this.getWeekNumber(date);
    return `${year}-W${String(week).padStart(2, '0')}`;
  }

  // Helper function to get week number
  private static getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}

// Database schema for progress tracking
export const PROGRESS_TRACKING_SCHEMA = `
-- Workout Sessions Table
CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id TEXT,
  workout_id TEXT,
  date DATE NOT NULL,
  duration INTEGER NOT NULL, -- minutes
  exercises JSONB NOT NULL,
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personal Records Table
CREATE TABLE IF NOT EXISTS personal_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  record_type TEXT NOT NULL CHECK (record_type IN ('MAX_WEIGHT', 'MAX_REPS', 'BEST_TIME', 'MAX_DISTANCE')),
  value DECIMAL NOT NULL,
  date DATE NOT NULL,
  workout_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_date ON workout_sessions(date);
CREATE INDEX IF NOT EXISTS idx_personal_records_user_id ON personal_records(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_exercise_id ON personal_records(exercise_id);

-- Row Level Security
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own workout sessions" ON workout_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout sessions" ON workout_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout sessions" ON workout_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout sessions" ON workout_sessions
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own personal records" ON personal_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own personal records" ON personal_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own personal records" ON personal_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own personal records" ON personal_records
  FOR DELETE USING (auth.uid() = user_id);
`;
