-- Setup Reviews Database for Drop-In Morocco
-- Run this in Supabase SQL Editor to enable reviews functionality

-- Step 1: Create reviews table
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

-- Step 6: Create RLS policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;

DROP POLICY IF EXISTS "Users can view review helpful" ON review_helpful;
DROP POLICY IF EXISTS "Users can create review helpful" ON review_helpful;
DROP POLICY IF EXISTS "Users can update their own review helpful" ON review_helpful;

-- Create new policies
CREATE POLICY "Users can view all reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view review helpful" ON review_helpful
  FOR SELECT USING (true);

CREATE POLICY "Users can create review helpful" ON review_helpful
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own review helpful" ON review_helpful
  FOR UPDATE USING (auth.uid() = user_id);

-- Step 7: Create functions for reviews
-- Function to update club rating when review is added/updated/deleted
CREATE OR REPLACE FUNCTION update_club_rating()
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
    )
  WHERE id = COALESCE(NEW.club_id, OLD.club_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_club_rating_insert ON reviews;
DROP TRIGGER IF EXISTS trigger_update_club_rating_update ON reviews;
DROP TRIGGER IF EXISTS trigger_update_club_rating_delete ON reviews;

CREATE TRIGGER trigger_update_club_rating_insert
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_club_rating();

CREATE TRIGGER trigger_update_club_rating_update
  AFTER UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_club_rating();

CREATE TRIGGER trigger_update_club_rating_delete
  AFTER DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_club_rating();

-- Step 8: Create function to check if user can review a club
CREATE OR REPLACE FUNCTION can_user_review_club(p_user_id UUID, p_club_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user has any paid orders for this club
  RETURN EXISTS (
    SELECT 1 
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = p_user_id 
    AND o.status = 'PAID'
    AND oi.club_id = p_club_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Create function to get club reviews with user info
CREATE OR REPLACE FUNCTION get_club_reviews(
  p_club_id UUID,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0,
  p_rating_filter INTEGER DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  club_id UUID,
  rating INTEGER,
  title VARCHAR(100),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  user_name TEXT,
  user_helpful BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.user_id,
    r.club_id,
    r.rating,
    r.title,
    r.comment,
    r.created_at,
    r.updated_at,
    COALESCE(p.full_name, 'Anonymous') as user_name,
    rh.is_helpful as user_helpful
  FROM reviews r
  LEFT JOIN profiles p ON r.user_id = p.id
  LEFT JOIN review_helpful rh ON r.id = rh.review_id AND rh.user_id = auth.uid()
  WHERE r.club_id = p_club_id
  AND (p_rating_filter IS NULL OR r.rating = p_rating_filter)
  ORDER BY r.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Grant permissions
GRANT ALL ON reviews TO authenticated;
GRANT ALL ON review_helpful TO authenticated;
GRANT EXECUTE ON FUNCTION can_user_review_club(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_club_reviews(UUID, INTEGER, INTEGER, INTEGER) TO authenticated;

-- Step 11: Insert some sample reviews for testing (optional)
-- Uncomment the following lines if you want to add sample reviews
/*
INSERT INTO reviews (user_id, club_id, rating, title, comment) VALUES
  ((SELECT id FROM profiles LIMIT 1), 'club-1', 5, 'Amazing gym!', 'Great facilities and friendly staff. Highly recommended!'),
  ((SELECT id FROM profiles LIMIT 1), 'club-1', 4, 'Good experience', 'Clean and well-equipped gym. Will come back again.'),
  ((SELECT id FROM profiles LIMIT 1), 'club-1', 5, 'Perfect!', 'Everything was excellent. The atmosphere is great for working out.');
*/

-- Step 12: Verify the setup
SELECT 'Reviews table created successfully' as status;
SELECT COUNT(*) as total_reviews FROM reviews;
SELECT COUNT(*) as total_clubs_with_ratings FROM clubs WHERE average_rating > 0;
