-- Debug Script for Clubs Loading Issue
-- This script helps diagnose why clubs aren't loading in the BookingsTest page

-- 1. Check if clubs exist and are active
SELECT 
  COUNT(*) as total_clubs,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_clubs
FROM clubs;

-- 2. Show sample active clubs
SELECT 
  id, 
  name, 
  tier, 
  city, 
  is_active,
  owner_id,
  created_at
FROM clubs 
WHERE is_active = true 
ORDER BY created_at DESC
LIMIT 5;

-- 3. Check RLS policies on clubs table
SELECT 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'clubs';

-- 4. Check if RLS is enabled on clubs table
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'clubs';

-- 5. Test direct query (this should work for authenticated users)
-- Replace 'your-user-id' with an actual user ID from auth.users
SELECT 
  'Testing direct query...' as test_message,
  COUNT(*) as clubs_visible_to_auth_user
FROM clubs 
WHERE is_active = true;

-- 6. Check if there are any profiles with CLUB_OWNER or ADMIN role
SELECT 
  id, 
  full_name, 
  email, 
  role,
  is_active
FROM profiles 
WHERE role IN ('CLUB_OWNER', 'ADMIN')
ORDER BY created_at DESC;

-- 7. Check the specific owner_id used in sample clubs
SELECT 
  'Checking sample club owner...' as test_message,
  id, 
  full_name, 
  email, 
  role,
  is_active
FROM profiles 
WHERE id = '7d8c6931-285d-4dee-9ba3-fbbe7ede4311';
