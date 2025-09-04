-- Drop-In Morocco: Fix RLS Infinite Recursion Issue
-- Run this in your Supabase SQL Editor

-- 1. Temporarily disable RLS on problematic tables
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE clubs DISABLE ROW LEVEL SECURITY;

-- 2. Check if there are any problematic policies
-- (This will show you what policies exist)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('products', 'clubs');

-- 3. If you want to see what's causing the recursion, 
-- you can re-enable RLS after testing and check individual policies:

-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

-- 4. For now, let's create simple, safe policies:

-- Drop any existing problematic policies (if they exist)
-- DROP POLICY IF EXISTS "products_policy" ON products;
-- DROP POLICY IF EXISTS "clubs_policy" ON clubs;

-- Create simple read-only policies for testing
-- CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
-- CREATE POLICY "Enable insert for authenticated users only" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- CREATE POLICY "Enable read access for all users" ON clubs FOR SELECT USING (true);
-- CREATE POLICY "Enable insert for authenticated users only" ON clubs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Note: Uncomment the above policies if you want to re-enable RLS with safe policies
