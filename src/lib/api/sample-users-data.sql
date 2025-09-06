-- Sample Users Data for Drop-In Morocco
-- Run this AFTER creating users in the auth system
-- Replace the UUIDs below with actual auth.users UUIDs

-- To get existing user UUIDs, run:
-- SELECT id, email FROM auth.users;

-- Step 1: Add sample customer profile (replace UUID with actual auth.users UUID)
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
(
  'REPLACE_WITH_ACTUAL_CUSTOMER_UUID', -- Replace with real auth.users UUID
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
)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Add sample gym owner profile (replace UUID with actual auth.users UUID)
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
(
  'REPLACE_WITH_ACTUAL_OWNER_UUID', -- Replace with real auth.users UUID
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

-- Step 3: Verify the data was inserted
SELECT 
  id,
  full_name,
  email,
  role,
  membership_status,
  verification_status,
  total_credits
FROM profiles 
WHERE full_name IN ('Ahmed Benali', 'Fatima Alami');

-- Success message
SELECT 'Sample users data added successfully! Remember to replace UUIDs with actual auth.users UUIDs.' as result;
