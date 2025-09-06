-- Super simple debug script to see what's actually in your database

-- 1. List all tables in the public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. If clubs table exists, show its exact structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'clubs' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Try to select from clubs table (if it exists)
SELECT COUNT(*) as club_count FROM clubs;

-- 4. Show any existing reviews tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%review%'
ORDER BY table_name;
