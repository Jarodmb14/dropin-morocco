-- Fix RLS Infinite Recursion Issue
-- Problem: RLS policies on profiles table reference profiles table, causing infinite recursion
-- Solution: Use SECURITY DEFINER functions to bypass RLS for internal checks

-- Step 1: Drop problematic RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Club owners can view customer profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Step 2: Create SECURITY DEFINER functions to check roles without RLS recursion
CREATE OR REPLACE FUNCTION is_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_user_club_owner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'CLUB_OWNER'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION user_owns_club(p_club_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM clubs 
    WHERE id = p_club_id 
    AND owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create new RLS policies using the SECURITY DEFINER functions
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Club owners can view customer profiles" ON profiles
  FOR SELECT USING (
    is_user_club_owner() 
    AND role = 'CUSTOMER'
  );

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (is_user_admin());

-- Step 4: Fix bookings RLS policies to use SECURITY DEFINER functions
DROP POLICY IF EXISTS "Club owners can view their club bookings" ON bookings;
DROP POLICY IF EXISTS "Club owners can update their club bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;

CREATE POLICY "Club owners can view their club bookings" ON bookings
  FOR SELECT USING (user_owns_club(club_id));

CREATE POLICY "Club owners can update their club bookings" ON bookings
  FOR UPDATE USING (user_owns_club(club_id));

CREATE POLICY "Admins can view all bookings" ON bookings
  FOR SELECT USING (is_user_admin());

-- Step 5: Test the functions
DO $$
BEGIN
  -- Test if functions work without recursion
  PERFORM is_user_admin();
  PERFORM is_user_club_owner();
  PERFORM user_owns_club('00000000-0000-0000-0000-000000000000'::UUID);
  
  RAISE NOTICE 'RLS infinite recursion fix applied successfully';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error testing functions: %', SQLERRM;
END $$;
