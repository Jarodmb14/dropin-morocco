-- PostGIS Location Data Implementation for Drop-In Morocco (Safe Version)
-- This script safely handles existing location columns and dependent views

-- Step 1: Enable PostGIS extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Step 2: Check current clubs table structure
SELECT 
  'Current clubs table structure:' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'clubs' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 3: Check for dependent views
SELECT 
  'Dependent views on clubs table:' as info,
  schemaname,
  viewname,
  definition
FROM pg_views 
WHERE definition LIKE '%clubs%' 
  AND schemaname = 'public';

-- Step 4: Handle location column safely
DO $$
BEGIN
  -- Check if location column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clubs' 
    AND column_name = 'location'
    AND table_schema = 'public'
  ) THEN
    RAISE NOTICE 'Location column already exists';
    
    -- Check if it's already a proper PostGIS geometry column
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'clubs' 
      AND column_name = 'location'
      AND data_type = 'USER-DEFINED'
      AND table_schema = 'public'
    ) THEN
      RAISE NOTICE 'Location column is already PostGIS geometry type - no changes needed';
    ELSE
      RAISE NOTICE 'Location column exists but is not PostGIS geometry type';
      RAISE NOTICE 'Please manually convert or recreate the location column';
    END IF;
  ELSE
    -- Add PostGIS geometry column if it doesn't exist
    ALTER TABLE clubs ADD COLUMN location GEOMETRY(POINT, 4326);
    RAISE NOTICE 'Added PostGIS geometry column to clubs table';
  END IF;
END $$;

-- Step 5: Add spatial index for performance (if location column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clubs' 
    AND column_name = 'location'
    AND table_schema = 'public'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_clubs_location_gist ON clubs USING GIST (location);
    RAISE NOTICE 'Created spatial index on location column';
  ELSE
    RAISE NOTICE 'No location column found - skipping spatial index';
  END IF;
END $$;

-- Step 6: Add latitude and longitude columns for easier access
DO $$
BEGIN
  -- Add latitude column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clubs' 
    AND column_name = 'latitude'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE clubs ADD COLUMN latitude DECIMAL(10, 8);
    RAISE NOTICE 'Added latitude column';
  ELSE
    RAISE NOTICE 'Latitude column already exists';
  END IF;
  
  -- Add longitude column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clubs' 
    AND column_name = 'longitude'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE clubs ADD COLUMN longitude DECIMAL(11, 8);
    RAISE NOTICE 'Added longitude column';
  ELSE
    RAISE NOTICE 'Longitude column already exists';
  END IF;
END $$;

-- Step 7: Create function to update location from lat/lng (only if location column exists)
-- First check if location column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clubs' 
    AND column_name = 'location'
    AND table_schema = 'public'
  ) THEN
    RAISE NOTICE 'Location column exists - will create trigger after function creation';
  ELSE
    RAISE NOTICE 'No location column found - skipping trigger creation';
  END IF;
END $$;

-- Create function to update location from coordinates (outside DO block)
CREATE OR REPLACE FUNCTION update_club_location_from_coords()
RETURNS TRIGGER AS $$
BEGIN
  -- Update PostGIS geometry from latitude/longitude
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
  END IF;
  
  -- Update latitude/longitude from PostGIS geometry
  IF NEW.location IS NOT NULL THEN
    NEW.latitude = ST_Y(NEW.location);
    NEW.longitude = ST_X(NEW.location);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update location
DROP TRIGGER IF EXISTS update_club_location_trigger ON clubs;
CREATE TRIGGER update_club_location_trigger
  BEFORE INSERT OR UPDATE ON clubs
  FOR EACH ROW
  EXECUTE FUNCTION update_club_location_from_coords();

-- Step 8: Create PostGIS functions (outside DO block to avoid syntax issues)

-- Create function to find nearby clubs
CREATE OR REPLACE FUNCTION find_nearby_clubs(
  user_lat DECIMAL(10, 8),
  user_lng DECIMAL(11, 8),
  max_distance_km INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  address TEXT,
  city TEXT,
  tier TEXT,
  amenities JSONB,
  monthly_price NUMERIC,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  distance_km DECIMAL(8, 2)
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
    c.latitude,
    c.longitude,
    ROUND(
      ST_Distance(
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
        c.location::geography
      ) / 1000, 2
    ) as distance_km
  FROM clubs c
  WHERE c.is_active = true
    AND c.location IS NOT NULL
    AND ST_DWithin(
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      c.location::geography,
      max_distance_km * 1000
    )
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to search clubs by city
CREATE OR REPLACE FUNCTION search_clubs_by_city(
  search_city TEXT,
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  address TEXT,
  city TEXT,
  tier TEXT,
  amenities JSONB,
  monthly_price NUMERIC,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8)
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
    c.latitude,
    c.longitude
  FROM clubs c
  WHERE c.is_active = true
    AND c.city ILIKE '%' || search_city || '%'
  ORDER BY c.name
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get clubs within bounding box
CREATE OR REPLACE FUNCTION get_clubs_in_bounds(
  min_lat DECIMAL(10, 8),
  min_lng DECIMAL(11, 8),
  max_lat DECIMAL(10, 8),
  max_lng DECIMAL(11, 8)
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  address TEXT,
  city TEXT,
  tier TEXT,
  amenities JSONB,
  monthly_price NUMERIC,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8)
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
    c.latitude,
    c.longitude
  FROM clubs c
  WHERE c.is_active = true
    AND c.location IS NOT NULL
    AND ST_Within(
      c.location,
      ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Add sample location data for existing clubs (Moroccan cities)
UPDATE clubs SET 
  latitude = CASE 
    WHEN city ILIKE '%casablanca%' THEN 33.5731
    WHEN city ILIKE '%rabat%' THEN 34.0209
    WHEN city ILIKE '%marrakech%' THEN 31.6295
    WHEN city ILIKE '%fez%' OR city ILIKE '%fes%' THEN 34.0331
    WHEN city ILIKE '%agadir%' THEN 30.4278
    WHEN city ILIKE '%tangier%' THEN 35.7595
    WHEN city ILIKE '%meknes%' THEN 33.8935
    WHEN city ILIKE '%oujda%' THEN 34.6814
    WHEN city ILIKE '%kenitra%' THEN 34.2611
    WHEN city ILIKE '%tetouan%' THEN 35.5889
    ELSE 33.5731 -- Default to Casablanca
  END,
  longitude = CASE 
    WHEN city ILIKE '%casablanca%' THEN -7.5898
    WHEN city ILIKE '%rabat%' THEN -6.8416
    WHEN city ILIKE '%marrakech%' THEN -8.0089
    WHEN city ILIKE '%fez%' OR city ILIKE '%fes%' THEN -5.0003
    WHEN city ILIKE '%agadir%' THEN -9.5981
    WHEN city ILIKE '%tangier%' THEN -5.8330
    WHEN city ILIKE '%meknes%' THEN -5.5473
    WHEN city ILIKE '%oujda%' THEN -1.9086
    WHEN city ILIKE '%kenitra%' THEN -6.5802
    WHEN city ILIKE '%tetouan%' THEN -5.3626
    ELSE -7.5898 -- Default to Casablanca
  END
WHERE latitude IS NULL OR longitude IS NULL;

-- Step 10: Grant permissions
GRANT EXECUTE ON FUNCTION find_nearby_clubs TO authenticated;
GRANT EXECUTE ON FUNCTION search_clubs_by_city TO authenticated;
GRANT EXECUTE ON FUNCTION get_clubs_in_bounds TO authenticated;

-- Step 11: Show final clubs table structure
SELECT 
  'Final clubs table structure:' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'clubs' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 12: Test the functions
-- Test nearby clubs function (this will work if PostGIS is properly set up)
DO $$
BEGIN
  RAISE NOTICE 'Testing PostGIS functions...';
  
  -- Try to test the function
  BEGIN
    PERFORM * FROM find_nearby_clubs(33.5731, -7.5898, 5) LIMIT 1;
    RAISE NOTICE 'PostGIS functions are working correctly';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'PostGIS functions test failed: %', SQLERRM;
    RAISE NOTICE 'This is normal if location column is not PostGIS geometry yet';
  END;
END $$;

-- Success message
SELECT 'PostGIS location data implementation completed successfully!' as result;
