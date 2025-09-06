-- Add Description Column to Clubs Table
-- Run this in your Supabase SQL Editor to add the description column

-- Step 1: Add description column to clubs table
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS description TEXT;

-- Step 2: Add a comment to document the column
COMMENT ON COLUMN clubs.description IS 'Detailed description of the gym/club facilities and services';

-- Step 3: Verify the column was added
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'clubs' 
  AND table_schema = 'public'
  AND column_name = 'description';

-- Step 4: Show current clubs table structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'clubs' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
