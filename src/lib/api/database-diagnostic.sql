-- Database Diagnostic Script for Drop-In Morocco
-- Run this first to check what tables exist

-- 1. Check if all required tables exist
SELECT 
  'Tables Check' as check_type,
  table_name,
  CASE 
    WHEN table_name IN ('profiles', 'clubs', 'orders', 'order_items') THEN '✅ Required'
    ELSE 'ℹ️ Optional'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'clubs', 'orders', 'order_items', 'reviews', 'review_helpful')
ORDER BY table_name;

-- 2. Check if clubs table has the required columns
SELECT 
  'Clubs Table Columns' as check_type,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'clubs' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check if profiles table has the required columns
SELECT 
  'Profiles Table Columns' as check_type,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Check if orders table has the required columns
SELECT 
  'Orders Table Columns' as check_type,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Check if order_items table has the required columns
SELECT 
  'Order Items Table Columns' as check_type,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'order_items' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. Check existing foreign key constraints
SELECT 
  'Foreign Keys' as check_type,
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
  AND tc.table_name IN ('profiles', 'clubs', 'orders', 'order_items')
ORDER BY tc.table_name, kcu.column_name;

-- 7. Check if reviews table already exists
SELECT 
  'Reviews Table Check' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reviews' AND table_schema = 'public') 
    THEN '✅ Reviews table exists'
    ELSE '❌ Reviews table does not exist'
  END as status;

-- 8. Check if review_helpful table already exists
SELECT 
  'Review Helpful Table Check' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'review_helpful' AND table_schema = 'public') 
    THEN '✅ Review_helpful table exists'
    ELSE '❌ Review_helpful table does not exist'
  END as status;

-- 9. Summary
SELECT 
  'SUMMARY' as check_type,
  'Run the reviews-schema-fixed.sql script if all required tables exist' as message;
