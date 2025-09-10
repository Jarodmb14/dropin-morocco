-- Setup Progress Tracking Tables
-- Run this SQL in your Supabase SQL editor

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

-- Policies for workout_sessions
CREATE POLICY "Users can view their own workout sessions" ON workout_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout sessions" ON workout_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout sessions" ON workout_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout sessions" ON workout_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for personal_records
CREATE POLICY "Users can view their own personal records" ON personal_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own personal records" ON personal_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own personal records" ON personal_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own personal records" ON personal_records
  FOR DELETE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON workout_sessions TO authenticated;
GRANT ALL ON personal_records TO authenticated;
