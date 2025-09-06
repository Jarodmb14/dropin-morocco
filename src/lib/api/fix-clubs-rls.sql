-- Fix Clubs RLS Policies for BookingsTest
-- This script ensures clubs are visible to all users (authenticated and anonymous)

-- 1. Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view nearby clubs" ON clubs;
DROP POLICY IF EXISTS "Users can view all clubs" ON clubs;
DROP POLICY IF EXISTS "Anyone can view active clubs" ON clubs;

-- 2. Create a simple policy that allows everyone to view active clubs
CREATE POLICY "Anyone can view active clubs" ON clubs
  FOR SELECT USING (is_active = true);

-- 3. Ensure RLS is enabled on clubs table
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

-- 4. Test the policy
DO $$
BEGIN
  -- Test if we can query clubs
  PERFORM COUNT(*) FROM clubs WHERE is_active = true;
  RAISE NOTICE 'RLS policy test successful - clubs are accessible';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'RLS policy test failed: %', SQLERRM;
END $$;

-- 5. Show current RLS status
SELECT 
  'Clubs table RLS status:' as info,
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'clubs';

-- 6. Show current policies
SELECT 
  'Current clubs policies:' as info,
  policyname, 
  permissive, 
  roles, 
  cmd
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'clubs';
