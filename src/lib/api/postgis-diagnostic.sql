-- PostGIS Diagnostic Script for Drop-In Morocco
-- This script helps diagnose the current state of PostGIS and location data

-- 1. Check if PostGIS extension is enabled
SELECT 
  'PostGIS Extension Status:' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') 
    THEN 'PostGIS is ENABLED' 
    ELSE 'PostGIS is NOT ENABLED' 
  END as status;

-- 2. Check PostGIS version if enabled
SELECT 
  'PostGIS Version:' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') 
    THEN PostGIS_version()
    ELSE 'PostGIS not available'
  END as version;

-- 3. Check clubs table structure
SELECT 
  'Clubs Table Structure:' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'clubs' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Check for dependent views on clubs table
SELECT 
  'Dependent Views:' as check_type,
  schemaname,
  viewname,
  CASE 
    WHEN definition LIKE '%location%' THEN 'References location column'
    ELSE 'References other columns'
  END as dependency_type
FROM pg_views 
WHERE definition LIKE '%clubs%' 
  AND schemaname = 'public';

-- 5. Check if location column is PostGIS geometry
SELECT 
  'Location Column Type:' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'clubs' 
      AND column_name = 'location'
      AND data_type = 'USER-DEFINED'
      AND table_schema = 'public'
    ) THEN 'Location column is PostGIS geometry'
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'clubs' 
      AND column_name = 'location'
      AND table_schema = 'public'
    ) THEN 'Location column exists but is not PostGIS geometry'
    ELSE 'No location column found'
  END as location_status;

-- 6. Check for spatial indexes
SELECT 
  'Spatial Indexes:' as check_type,
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'clubs' 
  AND indexdef LIKE '%GIST%';

-- 7. Check for PostGIS functions
SELECT 
  'PostGIS Functions:' as check_type,
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
  AND routine_name IN ('find_nearby_clubs', 'search_clubs_by_city', 'get_clubs_in_bounds')
ORDER BY routine_name;

-- 8. Sample location data check
SELECT 
  'Sample Location Data:' as check_type,
  COUNT(*) as total_clubs,
  COUNT(latitude) as clubs_with_latitude,
  COUNT(longitude) as clubs_with_longitude,
  COUNT(location) as clubs_with_location_geometry
FROM clubs;

-- 9. Sample of actual location data
SELECT 
  'Sample Location Values:' as check_type,
  name,
  city,
  latitude,
  longitude,
  CASE 
    WHEN location IS NOT NULL THEN 'Has geometry'
    ELSE 'No geometry'
  END as geometry_status
FROM clubs 
LIMIT 5;

-- 10. Recommendations
SELECT 
  'Recommendations:' as check_type,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') 
    THEN '1. Enable PostGIS extension: CREATE EXTENSION postgis;'
    ELSE '1. PostGIS extension is enabled ✓'
  END as recommendation_1,
  CASE 
    WHEN NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'clubs' 
      AND column_name = 'location'
      AND table_schema = 'public'
    )
    THEN '2. Add location column: ALTER TABLE clubs ADD COLUMN location GEOMETRY(POINT, 4326);'
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'clubs' 
      AND column_name = 'location'
      AND data_type = 'USER-DEFINED'
      AND table_schema = 'public'
    )
    THEN '2. Location column is PostGIS geometry ✓'
    ELSE '2. Convert location column to PostGIS geometry'
  END as recommendation_2,
  CASE 
    WHEN NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE tablename = 'clubs' 
      AND indexdef LIKE '%GIST%'
    )
    THEN '3. Add spatial index: CREATE INDEX idx_clubs_location_gist ON clubs USING GIST (location);'
    ELSE '3. Spatial index exists ✓'
  END as recommendation_3;

-- Success message
SELECT 'PostGIS diagnostic completed!' as result;
