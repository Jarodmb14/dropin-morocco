-- Debug Clubs Loading Issue
-- Run this in your Supabase SQL Editor to check what's happening

-- 1. Check if clubs exist
SELECT COUNT(*) as total_clubs FROM clubs;

-- 2. Check if clubs are active
SELECT COUNT(*) as active_clubs FROM clubs WHERE is_active = true;

-- 3. Check clubs with owner
SELECT COUNT(*) as clubs_with_owner FROM clubs WHERE owner_id = '7d8c6931-285d-4dee-9ba3-fbbe7ede4311';

-- 4. Show sample clubs
SELECT id, name, tier, city, is_active, owner_id 
FROM clubs 
WHERE is_active = true 
LIMIT 5;

-- 5. Check RLS policies on clubs table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'clubs';

-- 6. Test direct query (what the API should return)
SELECT * FROM clubs WHERE is_active = true LIMIT 3;
