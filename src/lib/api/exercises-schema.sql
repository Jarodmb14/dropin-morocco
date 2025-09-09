-- Exercises Table Schema for Drop-In Morocco
-- This creates a local exercises table for storing exercise data

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
CREATE INDEX IF NOT EXISTS idx_exercises_name ON exercises (name);

-- Enable RLS (Row Level Security)
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to exercises" ON exercises
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update
CREATE POLICY "Allow authenticated users to manage exercises" ON exercises
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policy to allow service role to manage exercises (for syncing)
CREATE POLICY "Allow service role to manage exercises" ON exercises
  FOR ALL USING (auth.role() = 'service_role');

-- Add comments for documentation
COMMENT ON TABLE exercises IS 'Stores exercise data for the fitness app';
COMMENT ON COLUMN exercises.body_part IS 'Primary body part targeted by the exercise';
COMMENT ON COLUMN exercises.target IS 'Specific muscle group targeted';
COMMENT ON COLUMN exercises.equipment IS 'Equipment required for the exercise';
COMMENT ON COLUMN exercises.instructions IS 'Step-by-step instructions for the exercise';
COMMENT ON COLUMN exercises.secondary_muscles IS 'Secondary muscle groups worked';
COMMENT ON COLUMN exercises.difficulty_level IS 'Exercise difficulty: beginner, intermediate, or advanced';
