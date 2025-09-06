-- Fix existing reviews table by adding missing club_id column
-- This script handles the case where reviews table exists but is missing club_id

-- Step 1: Check if reviews table exists and what columns it has
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'reviews' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 2: Add club_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reviews' 
    AND column_name = 'club_id'
    AND table_schema = 'public'
  ) THEN
    -- Add club_id column
    ALTER TABLE reviews ADD COLUMN club_id UUID;
    
    -- Add foreign key constraint
    ALTER TABLE reviews ADD CONSTRAINT reviews_club_id_fkey 
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE;
    
    RAISE NOTICE 'Added club_id column and foreign key constraint to reviews table';
  ELSE
    RAISE NOTICE 'club_id column already exists in reviews table';
  END IF;
END $$;

-- Step 3: Make club_id NOT NULL (after adding it)
DO $$
BEGIN
  -- Check if club_id column exists and is nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reviews' 
    AND column_name = 'club_id'
    AND is_nullable = 'YES'
    AND table_schema = 'public'
  ) THEN
    -- Make club_id NOT NULL
    ALTER TABLE reviews ALTER COLUMN club_id SET NOT NULL;
    RAISE NOTICE 'Made club_id column NOT NULL';
  END IF;
END $$;

-- Step 4: Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_reviews_club_id ON reviews(club_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Step 5: Enable RLS if not already enabled
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies (drop existing ones first)
DROP POLICY IF EXISTS "Users can view all reviews" ON reviews;
CREATE POLICY "Users can view all reviews" ON reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;
CREATE POLICY "Users can delete their own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Step 7: Grant permissions
GRANT ALL ON reviews TO authenticated;

-- Step 8: Show final table structure
SELECT 
  'Final reviews table structure:' as message,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'reviews' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Success message
SELECT 'Reviews table fixed successfully!' as result;
