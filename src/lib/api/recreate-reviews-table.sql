-- Completely drop and recreate reviews table with proper structure
-- Use this if the fix script doesn't work

-- Step 1: Drop existing reviews table and related objects
DROP TABLE IF EXISTS review_helpful CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

-- Step 2: Create reviews table with proper structure
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(100),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create review_helpful table
CREATE TABLE review_helpful (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- Step 4: Create indexes
CREATE INDEX idx_reviews_club_id ON reviews(club_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- Step 5: Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpful ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies
CREATE POLICY "Users can view all reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view review helpful votes" ON review_helpful
  FOR SELECT USING (true);

CREATE POLICY "Users can vote on reviews" ON review_helpful
  FOR ALL USING (auth.uid() = user_id);

-- Step 7: Grant permissions
GRANT ALL ON reviews TO authenticated;
GRANT ALL ON review_helpful TO authenticated;

-- Step 8: Show final structure
SELECT 
  'Reviews table recreated successfully!' as message,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'reviews' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
