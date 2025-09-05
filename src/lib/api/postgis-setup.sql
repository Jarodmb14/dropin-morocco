-- Drop-In Morocco: PostGIS Integration Setup
-- Run this in your Supabase SQL Editor to enable location-based features

-- 1. Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Add geometry column to clubs table for location data
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS location GEOMETRY(POINT, 4326);

-- 3. Create spatial index for performance
CREATE INDEX IF NOT EXISTS idx_clubs_location ON clubs USING GIST (location);

-- 4. Create function to get nearby clubs with distance
CREATE OR REPLACE FUNCTION get_nearby_clubs(
  user_lat DECIMAL,
  user_lng DECIMAL,
  max_distance_km INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  address TEXT,
  city TEXT,
  tier TEXT,
  amenities JSONB,
  monthly_price DECIMAL,
  distance_km DECIMAL,
  location GEOMETRY
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.address,
    c.city,
    c.tier::TEXT,
    c.amenities,
    c.monthly_price,
    ROUND(
      ST_Distance(
        c.location,
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)
      ) / 1000, 2
    ) as distance_km,
    c.location
  FROM clubs c
  WHERE 
    c.is_active = true
    AND c.location IS NOT NULL
    AND ST_DWithin(
      c.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326),
      max_distance_km * 1000
    )
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;

-- 5. Create function to search clubs by city with location
CREATE OR REPLACE FUNCTION search_clubs_by_city(
  search_city TEXT,
  user_lat DECIMAL DEFAULT NULL,
  user_lng DECIMAL DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  address TEXT,
  city TEXT,
  tier TEXT,
  amenities JSONB,
  monthly_price DECIMAL,
  distance_km DECIMAL,
  location GEOMETRY
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.address,
    c.city,
    c.tier::TEXT,
    c.amenities,
    c.monthly_price,
    CASE 
      WHEN user_lat IS NOT NULL AND user_lng IS NOT NULL AND c.location IS NOT NULL THEN
        ROUND(
          ST_Distance(
            c.location,
            ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)
          ) / 1000, 2
        )
      ELSE NULL
    END as distance_km,
    c.location
  FROM clubs c
  WHERE 
    c.is_active = true
    AND LOWER(c.city) LIKE LOWER('%' || search_city || '%')
  ORDER BY 
    CASE 
      WHEN user_lat IS NOT NULL AND user_lng IS NOT NULL AND c.location IS NOT NULL THEN
        ST_Distance(
          c.location,
          ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)
        )
      ELSE 999999
    END;
END;
$$ LANGUAGE plpgsql;

-- 6. Create function to update club location from lat/lng
CREATE OR REPLACE FUNCTION update_club_location(
  club_id UUID,
  latitude DECIMAL,
  longitude DECIMAL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE clubs 
  SET 
    location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326),
    updated_at = NOW()
  WHERE id = club_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- 7. Create function to get clubs within bounding box (for map views)
CREATE OR REPLACE FUNCTION get_clubs_in_bounds(
  north_lat DECIMAL,
  south_lat DECIMAL,
  east_lng DECIMAL,
  west_lng DECIMAL
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  address TEXT,
  city TEXT,
  tier TEXT,
  amenities JSONB,
  monthly_price DECIMAL,
  latitude DECIMAL,
  longitude DECIMAL,
  location GEOMETRY
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.address,
    c.city,
    c.tier::TEXT,
    c.amenities,
    c.monthly_price,
    ST_Y(c.location) as latitude,
    ST_X(c.location) as longitude,
    c.location
  FROM clubs c
  WHERE 
    c.is_active = true
    AND c.location IS NOT NULL
    AND ST_Within(
      c.location,
      ST_MakeEnvelope(west_lng, south_lat, east_lng, north_lat, 4326)
    );
END;
$$ LANGUAGE plpgsql;

-- 8. Add RLS policies for location functions
DROP POLICY IF EXISTS "Users can view nearby clubs" ON clubs;
CREATE POLICY "Users can view nearby clubs" ON clubs
  FOR SELECT USING (is_active = true);

-- 9. Create checkins table for QR code usage tracking
CREATE TABLE IF NOT EXISTS checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  qr_code TEXT NOT NULL,
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(qr_code)
);

-- 10. Add RLS policies for checkins
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own checkins" ON checkins;
DROP POLICY IF EXISTS "Club owners can view their club checkins" ON checkins;

-- Create policies
CREATE POLICY "Users can view their own checkins" ON checkins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Club owners can view their club checkins" ON checkins
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM clubs 
      WHERE clubs.id = checkins.club_id 
      AND clubs.owner_id = auth.uid()
    )
  );

-- 11. Create reviews table for user feedback
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_moderated BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, club_id, booking_id)
);

-- 12. Add RLS policies for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews for their bookings" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;

-- Create policies
CREATE POLICY "Users can view all reviews" ON reviews
  FOR SELECT USING (true);

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

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- 13. Create function to get club statistics with location
CREATE OR REPLACE FUNCTION get_club_stats_with_location(club_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  city TEXT,
  tier TEXT,
  monthly_price DECIMAL,
  total_bookings BIGINT,
  total_revenue DECIMAL,
  average_rating DECIMAL,
  total_reviews BIGINT,
  latitude DECIMAL,
  longitude DECIMAL,
  location GEOMETRY
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.city,
    c.tier::TEXT,
    c.monthly_price,
    COALESCE(booking_stats.total_bookings, 0) as total_bookings,
    COALESCE(booking_stats.total_revenue, 0) as total_revenue,
    COALESCE(review_stats.average_rating, 0) as average_rating,
    COALESCE(review_stats.total_reviews, 0) as total_reviews,
    ST_Y(c.location) as latitude,
    ST_X(c.location) as longitude,
    c.location
  FROM clubs c
  LEFT JOIN (
    SELECT 
      club_id,
      COUNT(*) as total_bookings,
      SUM(total_amount) as total_revenue
    FROM orders 
    WHERE status = 'PAID'
    GROUP BY club_id
  ) booking_stats ON c.id = booking_stats.club_id
  LEFT JOIN (
    SELECT 
      club_id,
      AVG(rating) as average_rating,
      COUNT(*) as total_reviews
    FROM reviews 
    WHERE is_moderated = true
    GROUP BY club_id
  ) review_stats ON c.id = review_stats.club_id
  WHERE c.id = club_id;
END;
$$ LANGUAGE plpgsql;

-- 14. Insert sample location data for existing clubs
-- Update clubs with real Moroccan coordinates
UPDATE clubs SET 
  location = ST_SetSRID(ST_MakePoint(-7.5898, 33.5731), 4326),
  updated_at = NOW()
WHERE name LIKE '%Casablanca%' AND location IS NULL;

UPDATE clubs SET 
  location = ST_SetSRID(ST_MakePoint(-8.0089, 31.6295), 4326),
  updated_at = NOW()
WHERE name LIKE '%Marrakech%' AND location IS NULL;

UPDATE clubs SET 
  location = ST_SetSRID(ST_MakePoint(-6.8416, 34.0209), 4326),
  updated_at = NOW()
WHERE name LIKE '%Rabat%' AND location IS NULL;

-- 15. Create view for easy club location access
CREATE OR REPLACE VIEW clubs_with_location AS
SELECT 
  c.*,
  ST_Y(c.location) as latitude,
  ST_X(c.location) as longitude
FROM clubs c
WHERE c.location IS NOT NULL;

-- 16. Grant necessary permissions
GRANT SELECT ON clubs_with_location TO authenticated;
GRANT EXECUTE ON FUNCTION get_nearby_clubs TO authenticated;
GRANT EXECUTE ON FUNCTION search_clubs_by_city TO authenticated;
GRANT EXECUTE ON FUNCTION get_clubs_in_bounds TO authenticated;
GRANT EXECUTE ON FUNCTION get_club_stats_with_location TO authenticated;
GRANT EXECUTE ON FUNCTION update_club_location TO authenticated;

-- Success message
SELECT 'PostGIS integration completed successfully! 🗺️' as status;
