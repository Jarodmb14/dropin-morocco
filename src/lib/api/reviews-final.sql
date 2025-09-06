-- Final Reviews Table Creation for Drop-In Morocco
-- Based on actual clubs table structure from your database

-- Step 1: Create the basic reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(100),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create review_helpful table
CREATE TABLE IF NOT EXISTS review_helpful (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- Step 3: Add rating columns to clubs table (only if they don't exist)
DO $$
BEGIN
  -- Add average_rating column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'average_rating') THEN
    ALTER TABLE clubs ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0.00;
  END IF;
  
  -- Add total_reviews column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'total_reviews') THEN
    ALTER TABLE clubs ADD COLUMN total_reviews INTEGER DEFAULT 0;
  END IF;
END $$;

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_club_id ON reviews(club_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Step 5: Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpful ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for reviews
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

-- Step 7: Create RLS policies for review_helpful
DROP POLICY IF EXISTS "Users can view review helpful votes" ON review_helpful;
CREATE POLICY "Users can view review helpful votes" ON review_helpful
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can vote on reviews" ON review_helpful;
CREATE POLICY "Users can vote on reviews" ON review_helpful
  FOR ALL USING (auth.uid() = user_id);

-- Step 8: Grant permissions
GRANT ALL ON reviews TO authenticated;
GRANT ALL ON review_helpful TO authenticated;

-- Step 9: Create function to update club ratings automatically
CREATE OR REPLACE FUNCTION update_club_ratings()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the club's average rating and total reviews
  UPDATE clubs 
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0.00) 
      FROM reviews 
      WHERE club_id = COALESCE(NEW.club_id, OLD.club_id)
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE club_id = COALESCE(NEW.club_id, OLD.club_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.club_id, OLD.club_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Step 10: Create trigger to automatically update club ratings
DROP TRIGGER IF EXISTS update_club_ratings_trigger ON reviews;
CREATE TRIGGER update_club_ratings_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_club_ratings();

-- Success message
SELECT 'Reviews system created successfully!' as message;
