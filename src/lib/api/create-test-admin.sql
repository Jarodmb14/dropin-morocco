-- Create Test Admin User
-- Run this in Supabase SQL Editor to create a test admin user

-- Step 1: Create a test admin user in auth.users (if not exists)
-- Note: You'll need to sign up with admin@test.com first through the app
-- Then run this script to update the user metadata

-- Update the user metadata to set role as ADMIN
UPDATE auth.users 
SET user_metadata = jsonb_set(
  COALESCE(user_metadata, '{}'::jsonb), 
  '{role}', 
  '"ADMIN"'::jsonb
)
WHERE email = 'admin@test.com';

-- Also mark email as confirmed
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmation_sent_at = NULL
WHERE email = 'admin@test.com';

-- Step 2: Create profile entry for the admin user
-- First, get the user ID
-- SELECT id FROM auth.users WHERE email = 'admin@test.com';

-- Then insert into profiles table (replace the UUID with actual user ID)
INSERT INTO profiles (
  id, 
  full_name, 
  email, 
  phone, 
  role, 
  country,
  membership_status,
  verification_status,
  is_active,
  terms_accepted_at,
  privacy_accepted_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@test.com'),
  'Test Admin',
  'admin@test.com',
  '+212600000000',
  'ADMIN',
  'Morocco',
  'ACTIVE',
  'VERIFIED',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'ADMIN',
  updated_at = NOW();

-- Step 3: Verify the admin user was created
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.user_metadata,
  p.role as profile_role,
  p.full_name
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'admin@test.com';

-- Step 4: Test the is_admin function
SELECT is_admin() as current_user_is_admin;
