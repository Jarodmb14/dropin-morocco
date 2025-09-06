-- Super simple test to check what's happening

-- 1. Check if clubs table exists
SELECT 'clubs table exists' as status
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clubs' AND table_schema = 'public');

-- 2. If clubs table exists, show its structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clubs' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Try to create a simple test table that references clubs
CREATE TABLE IF NOT EXISTS test_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL
);

-- 4. If successful, drop the test table
DROP TABLE IF EXISTS test_reviews;

SELECT 'Test completed successfully!' as result;
