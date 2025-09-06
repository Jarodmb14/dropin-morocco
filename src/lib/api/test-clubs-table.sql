-- Test script to verify clubs table exists and has correct structure

-- 1. Check if clubs table exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clubs' AND table_schema = 'public') 
    THEN '✅ clubs table exists'
    ELSE '❌ clubs table does not exist'
  END as clubs_table_status;

-- 2. Check clubs table columns
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'clubs' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check if clubs table has any data
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM clubs LIMIT 1)
    THEN '✅ clubs table has data'
    ELSE '⚠️ clubs table is empty'
  END as clubs_data_status;

-- 4. Show sample clubs data (if any)
SELECT id, name, city, tier, is_active 
FROM clubs 
LIMIT 5;

-- 5. Check foreign key constraints
SELECT 
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
  AND tc.table_name = 'clubs';
