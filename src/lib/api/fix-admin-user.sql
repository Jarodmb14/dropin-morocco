-- Disable email confirmation for testing
-- Run this in Supabase SQL Editor

-- Update the auth.users table to mark admin@gmail.com as confirmed
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmation_sent_at = NULL
WHERE email = 'admin@gmail.com';

-- Also update the user metadata to ensure role is set
UPDATE auth.users 
SET user_metadata = jsonb_set(
  COALESCE(user_metadata, '{}'::jsonb), 
  '{role}', 
  '"ADMIN"'::jsonb
)
WHERE email = 'admin@gmail.com';

-- Check the result
SELECT id, email, email_confirmed_at, user_metadata 
FROM auth.users 
WHERE email = 'admin@gmail.com';
