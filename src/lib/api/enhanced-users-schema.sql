-- Enhanced Users Table Schema for Drop-In Morocco
-- This builds upon the existing profiles table with additional fields for customers and gym owners

-- Step 1: Add additional columns to existing profiles table
DO $$
BEGIN
  -- Add customer-specific fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'date_of_birth') THEN
    ALTER TABLE profiles ADD COLUMN date_of_birth DATE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'gender') THEN
    ALTER TABLE profiles ADD COLUMN gender VARCHAR(10) CHECK (gender IN ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'emergency_contact') THEN
    ALTER TABLE profiles ADD COLUMN emergency_contact JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'fitness_level') THEN
    ALTER TABLE profiles ADD COLUMN fitness_level VARCHAR(20) CHECK (fitness_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'preferred_activities') THEN
    ALTER TABLE profiles ADD COLUMN preferred_activities TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'membership_status') THEN
    ALTER TABLE profiles ADD COLUMN membership_status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (membership_status IN ('ACTIVE', 'SUSPENDED', 'CANCELLED'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_credits') THEN
    ALTER TABLE profiles ADD COLUMN total_credits INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'used_credits') THEN
    ALTER TABLE profiles ADD COLUMN used_credits INTEGER DEFAULT 0;
  END IF;
  
  -- Add gym owner-specific fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_name') THEN
    ALTER TABLE profiles ADD COLUMN business_name VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_registration') THEN
    ALTER TABLE profiles ADD COLUMN business_registration VARCHAR(100);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_address') THEN
    ALTER TABLE profiles ADD COLUMN business_address TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_phone') THEN
    ALTER TABLE profiles ADD COLUMN business_phone VARCHAR(20);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_email') THEN
    ALTER TABLE profiles ADD COLUMN business_email VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bank_account_info') THEN
    ALTER TABLE profiles ADD COLUMN bank_account_info JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verification_status') THEN
    ALTER TABLE profiles ADD COLUMN verification_status VARCHAR(20) DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED'));
  END IF;
  
  -- Add common fields for all users
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'profile_picture_url') THEN
    ALTER TABLE profiles ADD COLUMN profile_picture_url TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN
    ALTER TABLE profiles ADD COLUMN bio TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'preferred_language') THEN
    ALTER TABLE profiles ADD COLUMN preferred_language VARCHAR(10) DEFAULT 'en' CHECK (preferred_language IN ('en', 'fr', 'ar', 'es'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'notification_preferences') THEN
    ALTER TABLE profiles ADD COLUMN notification_preferences JSONB DEFAULT '{"email": true, "sms": true, "push": true}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_login_at') THEN
    ALTER TABLE profiles ADD COLUMN last_login_at TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_active') THEN
    ALTER TABLE profiles ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'terms_accepted_at') THEN
    ALTER TABLE profiles ADD COLUMN terms_accepted_at TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'privacy_accepted_at') THEN
    ALTER TABLE profiles ADD COLUMN privacy_accepted_at TIMESTAMPTZ;
  END IF;
  
  RAISE NOTICE 'Enhanced profiles table with additional columns created successfully';
END $$;

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_membership_status ON profiles (membership_status);
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status ON profiles (verification_status);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles (is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON profiles (last_login_at);
CREATE INDEX IF NOT EXISTS idx_profiles_country ON profiles (country);

-- Step 3: Create function to update last login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles 
  SET last_login_at = NOW() 
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create trigger to update last login (if auth.users table exists)
-- Note: This would need to be connected to Supabase auth.users table
-- For now, we'll create a manual function to call

-- Step 5: Create function to get user profile with role-specific data
CREATE OR REPLACE FUNCTION get_user_profile(user_id UUID)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT,
  country TEXT,
  date_of_birth DATE,
  gender TEXT,
  fitness_level TEXT,
  preferred_activities TEXT[],
  membership_status TEXT,
  total_credits INTEGER,
  used_credits INTEGER,
  business_name TEXT,
  business_registration TEXT,
  business_address TEXT,
  business_phone TEXT,
  business_email TEXT,
  verification_status TEXT,
  profile_picture_url TEXT,
  bio TEXT,
  preferred_language TEXT,
  notification_preferences JSONB,
  last_login_at TIMESTAMPTZ,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.email,
    p.phone,
    p.role::TEXT,
    p.country,
    p.date_of_birth,
    p.gender,
    p.fitness_level,
    p.preferred_activities,
    p.membership_status,
    p.total_credits,
    p.used_credits,
    p.business_name,
    p.business_registration,
    p.business_address,
    p.business_phone,
    p.business_email,
    p.verification_status,
    p.profile_picture_url,
    p.bio,
    p.preferred_language,
    p.notification_preferences,
    p.last_login_at,
    p.is_active,
    p.created_at,
    p.updated_at
  FROM profiles p
  WHERE p.id = user_id AND p.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create function to update user credits
CREATE OR REPLACE FUNCTION update_user_credits(
  user_id UUID,
  credit_change INTEGER,
  operation TEXT DEFAULT 'ADD' -- 'ADD' or 'SUBTRACT'
)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
  new_credits INTEGER;
BEGIN
  -- Get current credits
  SELECT total_credits INTO current_credits
  FROM profiles
  WHERE id = user_id;
  
  IF current_credits IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Calculate new credits
  IF operation = 'ADD' THEN
    new_credits := current_credits + credit_change;
  ELSIF operation = 'SUBTRACT' THEN
    new_credits := current_credits - credit_change;
    IF new_credits < 0 THEN
      RETURN FALSE; -- Insufficient credits
    END IF;
  ELSE
    RETURN FALSE; -- Invalid operation
  END IF;
  
  -- Update credits
  UPDATE profiles
  SET 
    total_credits = new_credits,
    used_credits = CASE 
      WHEN operation = 'SUBTRACT' THEN used_credits + credit_change
      ELSE used_credits
    END,
    updated_at = NOW()
  WHERE id = user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create function to get gym owners with their clubs
CREATE OR REPLACE FUNCTION get_gym_owner_with_clubs(input_owner_id UUID)
RETURNS TABLE (
  owner_id UUID,
  owner_name TEXT,
  owner_email TEXT,
  owner_phone TEXT,
  business_name TEXT,
  business_registration TEXT,
  verification_status TEXT,
  club_id UUID,
  club_name TEXT,
  club_tier TEXT,
  club_city TEXT,
  club_is_active BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as owner_id,
    p.full_name as owner_name,
    p.email as owner_email,
    p.phone as owner_phone,
    p.business_name,
    p.business_registration,
    p.verification_status,
    c.id as club_id,
    c.name as club_name,
    c.tier::TEXT as club_tier,
    c.city as club_city,
    c.is_active as club_is_active
  FROM profiles p
  LEFT JOIN clubs c ON c.owner_id = p.id
  WHERE p.id = input_owner_id 
    AND p.role = 'CLUB_OWNER'
    AND p.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Update RLS policies for enhanced profiles table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Club owners can view customer profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create new RLS policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Club owners can view customer profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM clubs 
      WHERE clubs.owner_id = auth.uid() 
      AND profiles.role = 'CUSTOMER'
    )
  );

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'ADMIN'
    )
  );

-- Step 9: Sample data insertion (commented out to avoid foreign key conflicts)
-- Note: Sample data requires existing auth.users entries
-- Uncomment and modify the UUIDs below if you have existing users in auth.users

/*
INSERT INTO profiles (
  id, 
  full_name, 
  email, 
  phone, 
  role, 
  country,
  date_of_birth,
  gender,
  fitness_level,
  preferred_activities,
  membership_status,
  total_credits,
  business_name,
  business_registration,
  verification_status,
  bio,
  preferred_language,
  is_active,
  terms_accepted_at,
  privacy_accepted_at
) VALUES 
-- Sample Customer (replace with actual auth.users UUID)
(
  'REPLACE_WITH_ACTUAL_USER_UUID',
  'Ahmed Benali',
  'ahmed.benali@example.com',
  '+212612345678',
  'CUSTOMER',
  'Morocco',
  '1990-05-15',
  'MALE',
  'INTERMEDIATE',
  ARRAY['Weight Training', 'Cardio', 'Swimming'],
  'ACTIVE',
  50,
  NULL,
  NULL,
  'VERIFIED',
  'Fitness enthusiast from Casablanca',
  'ar',
  true,
  NOW(),
  NOW()
),
-- Sample Gym Owner (replace with actual auth.users UUID)
(
  'REPLACE_WITH_ACTUAL_OWNER_UUID',
  'Fatima Alami',
  'fatima.alami@gym.com',
  '+212698765432',
  'CLUB_OWNER',
  'Morocco',
  '1985-03-22',
  'FEMALE',
  'ADVANCED',
  ARRAY['Yoga', 'Pilates', 'Strength Training'],
  'ACTIVE',
  0,
  'Elite Fitness Center',
  'RC123456789',
  'VERIFIED',
  'Certified fitness trainer and gym owner',
  'fr',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
*/

-- Step 10: Create view for customer dashboard data
CREATE OR REPLACE VIEW customer_dashboard AS
SELECT 
  p.id,
  p.full_name,
  p.email,
  p.phone,
  p.total_credits,
  p.used_credits,
  (p.total_credits - p.used_credits) as available_credits,
  p.membership_status,
  p.fitness_level,
  p.preferred_activities,
  p.last_login_at,
  COUNT(DISTINCT o.id) as total_bookings,
  COUNT(DISTINCT CASE WHEN o.status = 'PAID' THEN o.id END) as completed_bookings,
  COUNT(DISTINCT r.id) as total_reviews
FROM profiles p
LEFT JOIN orders o ON o.user_id = p.id
LEFT JOIN reviews r ON r.user_id = p.id
WHERE p.role = 'CUSTOMER' AND p.is_active = true
GROUP BY p.id, p.full_name, p.email, p.phone, p.total_credits, p.used_credits, 
         p.membership_status, p.fitness_level, p.preferred_activities, p.last_login_at;

-- Step 11: Create view for gym owner dashboard data
CREATE OR REPLACE VIEW gym_owner_dashboard AS
SELECT 
  p.id as owner_id,
  p.full_name as owner_name,
  p.email as owner_email,
  p.business_name,
  p.verification_status,
  COUNT(DISTINCT c.id) as total_clubs,
  COUNT(DISTINCT CASE WHEN c.is_active = true THEN c.id END) as active_clubs,
  COUNT(DISTINCT o.id) as total_bookings,
  COUNT(DISTINCT CASE WHEN o.status = 'PAID' THEN o.id END) as completed_bookings,
  COALESCE(SUM(CASE WHEN o.status = 'PAID' THEN o.total_amount ELSE 0 END), 0) as total_revenue
FROM profiles p
LEFT JOIN clubs c ON c.owner_id = p.id
LEFT JOIN orders o ON o.club_id = c.id
WHERE p.role = 'CLUB_OWNER' AND p.is_active = true
GROUP BY p.id, p.full_name, p.email, p.business_name, p.verification_status;

-- Success message
SELECT 'Enhanced users table schema implemented successfully!' as result;
