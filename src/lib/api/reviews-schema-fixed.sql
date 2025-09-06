-- Reviews and Ratings System for Drop-In Morocco (Fixed Version)
-- This script creates the necessary tables and functions for gym reviews

-- Check if required tables exist first
DO $$
BEGIN
  -- Check if clubs table exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clubs') THEN
    RAISE EXCEPTION 'clubs table does not exist. Please create it first.';
  END IF;
  
  -- Check if profiles table exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    RAISE EXCEPTION 'profiles table does not exist. Please create it first.';
  END IF;
  
  -- Check if orders table exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
    RAISE EXCEPTION 'orders table does not exist. Please create it first.';
  END IF;
END $$;

-- 1. Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  
  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(100),
  comment TEXT,
  
  -- Detailed ratings (1-5 scale)
  cleanliness INTEGER CHECK (cleanliness >= 1 AND cleanliness <= 5),
  equipment INTEGER CHECK (equipment >= 1 AND equipment <= 5),
  staff_friendliness INTEGER CHECK (staff_friendliness >= 1 AND staff_friendliness <= 5),
  value_for_money INTEGER CHECK (value_for_money >= 1 AND value_for_money <= 5),
  atmosphere INTEGER CHECK (atmosphere >= 1 AND atmosphere <= 5),
  
  -- Review metadata
  is_verified BOOLEAN DEFAULT false, -- Verified purchase
  is_featured BOOLEAN DEFAULT false, -- Featured review
  helpful_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, club_id, booking_id), -- One review per booking
  CONSTRAINT valid_rating CHECK (rating IS NOT NULL)
);

-- 2. Create review_helpful table (users can mark reviews as helpful)
CREATE TABLE IF NOT EXISTS review_helpful (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(review_id, user_id) -- One vote per user per review
);

-- 3. Add rating fields to clubs table (only if they don't exist)
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
  
  -- Add rating_breakdown column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'rating_breakdown') THEN
    ALTER TABLE clubs ADD COLUMN rating_breakdown JSONB DEFAULT '{"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}'::jsonb;
  END IF;
END $$;

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_club_id ON reviews(club_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_helpful_review_id ON review_helpful(review_id);

-- 5. Create function to update club ratings
CREATE OR REPLACE FUNCTION update_club_ratings(p_club_id UUID)
RETURNS VOID AS $$
DECLARE
  avg_rating DECIMAL(3,2);
  total_count INTEGER;
  rating_dist JSONB;
BEGIN
  -- Calculate average rating and total count
  SELECT 
    COALESCE(AVG(rating), 0.00),
    COUNT(*)
  INTO avg_rating, total_count
  FROM reviews 
  WHERE club_id = p_club_id;
  
  -- Calculate rating distribution
  SELECT jsonb_object_agg(
    rating::text, 
    count
  ) INTO rating_dist
  FROM (
    SELECT rating, COUNT(*) as count
    FROM reviews 
    WHERE club_id = p_club_id
    GROUP BY rating
    ORDER BY rating
  ) rating_counts;
  
  -- Update club with new ratings
  UPDATE clubs 
  SET 
    average_rating = avg_rating,
    total_reviews = total_count,
    rating_breakdown = COALESCE(rating_dist, '{"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}'::jsonb),
    updated_at = NOW()
  WHERE id = p_club_id;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger to automatically update club ratings
CREATE OR REPLACE FUNCTION trigger_update_club_ratings()
RETURNS TRIGGER AS $$
BEGIN
  -- Update ratings for the affected club
  IF TG_OP = 'DELETE' THEN
    PERFORM update_club_ratings(OLD.club_id);
    RETURN OLD;
  ELSE
    PERFORM update_club_ratings(NEW.club_id);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_club_ratings_trigger ON reviews;
CREATE TRIGGER update_club_ratings_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_club_ratings();

-- 7. Create function to get club reviews with pagination
CREATE OR REPLACE FUNCTION get_club_reviews(
  p_club_id UUID,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0,
  p_rating_filter INTEGER DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  user_name TEXT,
  user_avatar TEXT,
  rating INTEGER,
  title TEXT,
  comment TEXT,
  cleanliness INTEGER,
  equipment INTEGER,
  staff_friendliness INTEGER,
  value_for_money INTEGER,
  atmosphere INTEGER,
  is_verified BOOLEAN,
  helpful_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  user_helpful BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    COALESCE(p.full_name, 'Anonymous') as user_name,
    NULL as user_avatar, -- TODO: Add avatar field to profiles
    r.rating,
    r.title,
    r.comment,
    r.cleanliness,
    r.equipment,
    r.staff_friendliness,
    r.value_for_money,
    r.atmosphere,
    r.is_verified,
    r.helpful_count,
    r.created_at,
    COALESCE(rh.is_helpful, false) as user_helpful
  FROM reviews r
  JOIN profiles p ON r.user_id = p.id
  LEFT JOIN review_helpful rh ON r.id = rh.review_id AND rh.user_id = auth.uid()
  WHERE r.club_id = p_club_id
    AND (p_rating_filter IS NULL OR r.rating = p_rating_filter)
  ORDER BY r.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpful ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies for reviews
DROP POLICY IF EXISTS "Users can view all reviews" ON reviews;
CREATE POLICY "Users can view all reviews" ON reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create reviews for their bookings" ON reviews;
CREATE POLICY "Users can create reviews for their bookings" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id 
    AND EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = booking_id 
      AND orders.user_id = auth.uid()
      AND orders.status = 'PAID'
    )
  );

DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;
CREATE POLICY "Users can delete their own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- 10. Create RLS policies for review_helpful
DROP POLICY IF EXISTS "Users can view review helpful votes" ON review_helpful;
CREATE POLICY "Users can view review helpful votes" ON review_helpful
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can vote on reviews" ON review_helpful;
CREATE POLICY "Users can vote on reviews" ON review_helpful
  FOR ALL USING (auth.uid() = user_id);

-- 11. Create enum for review status (optional)
DO $$ BEGIN
  CREATE TYPE review_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 12. Add review status to reviews table (optional)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'status') THEN
    ALTER TABLE reviews ADD COLUMN status review_status DEFAULT 'APPROVED';
  END IF;
END $$;

-- 13. Create function to check if user can review a club
CREATE OR REPLACE FUNCTION can_user_review_club(p_user_id UUID, p_club_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  has_paid_booking BOOLEAN;
  has_existing_review BOOLEAN;
BEGIN
  -- Check if user has a paid booking for this club
  SELECT EXISTS(
    SELECT 1 FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = p_user_id 
    AND oi.club_id = p_club_id
    AND o.status = 'PAID'
  ) INTO has_paid_booking;
  
  -- Check if user already reviewed this club
  SELECT EXISTS(
    SELECT 1 FROM reviews 
    WHERE user_id = p_user_id 
    AND club_id = p_club_id
  ) INTO has_existing_review;
  
  RETURN has_paid_booking AND NOT has_existing_review;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON reviews TO authenticated;
GRANT ALL ON review_helpful TO authenticated;
GRANT EXECUTE ON FUNCTION get_club_reviews TO authenticated;
GRANT EXECUTE ON FUNCTION can_user_review_club TO authenticated;
GRANT EXECUTE ON FUNCTION update_club_ratings TO authenticated;

-- 15. Success message
DO $$
BEGIN
  RAISE NOTICE 'Reviews and ratings system created successfully!';
  RAISE NOTICE 'Tables created: reviews, review_helpful';
  RAISE NOTICE 'Functions created: update_club_ratings, get_club_reviews, can_user_review_club';
  RAISE NOTICE 'RLS policies enabled for data security';
END $$;
