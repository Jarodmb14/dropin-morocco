-- TEMPORARY FIX: Disable RLS on clubs table for testing
-- This allows all users (authenticated and anonymous) to access clubs

-- 1. Disable RLS temporarily
ALTER TABLE clubs DISABLE ROW LEVEL SECURITY;

-- 2. Verify RLS is disabled
SELECT 
  'Clubs table RLS status:' as info,
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'clubs';

-- 3. Test direct access
SELECT COUNT(*) as total_clubs FROM clubs WHERE is_active = true;

-- 4. Show sample clubs
SELECT id, name, tier, city, is_active 
FROM clubs 
WHERE is_active = true 
LIMIT 5;

-- NOTE: This is a temporary fix for testing
-- In production, you should re-enable RLS with proper policies
