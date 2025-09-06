-- Add Sample Clubs for Testing
-- Run this in your Supabase SQL Editor to add test clubs

-- Insert Sample Clubs (without description column)
INSERT INTO clubs (name, tier, city, address, latitude, longitude, amenities, contact_phone, contact_email, is_active, owner_id) VALUES
-- Casablanca clubs
('FitZone Casablanca', 'STANDARD', 'Casablanca', 'Boulevard Mohammed V, Casablanca', 33.5731, -7.5898, ARRAY['cardio', 'weights', 'group_classes'], '+212522123456', 'info@fitzone-casa.ma', true, '00000000-0000-0000-0000-000000000001'),

('Premium Gym Casa', 'PREMIUM', 'Casablanca', 'Maarif, Casablanca', 33.5792, -7.6187, ARRAY['cardio', 'weights', 'spa', 'personal_training', 'pool'], '+212522234567', 'contact@premiumgym.ma', true, '00000000-0000-0000-0000-000000000002'),

('Basic Fitness Center', 'BASIC', 'Casablanca', 'Derb Ghallef, Casablanca', 33.5650, -7.6034, ARRAY['cardio', 'weights'], '+212522345678', 'info@basicfitness.ma', true, '00000000-0000-0000-0000-000000000003'),

-- Rabat clubs
('Royal Fitness Rabat', 'PREMIUM', 'Rabat', 'Agdal, Rabat', 34.0209, -6.8416, ARRAY['cardio', 'weights', 'spa', 'personal_training'], '+212537123456', 'info@royalfitness.ma', true, '00000000-0000-0000-0000-000000000004'),

('City Gym Rabat', 'STANDARD', 'Rabat', 'Hassan, Rabat', 34.0134, -6.8480, ARRAY['cardio', 'weights', 'group_classes'], '+212537234567', 'contact@citygym.ma', true, '00000000-0000-0000-0000-000000000005'),

-- Marrakech clubs
('Atlas Fitness Marrakech', 'STANDARD', 'Marrakech', 'Gueliz, Marrakech', 31.6348, -8.0099, ARRAY['cardio', 'weights', 'group_classes'], '+212524234567', 'info@atlasfitness.ma', true, '00000000-0000-0000-0000-000000000006'),

('Medina Gym', 'BASIC', 'Marrakech', 'Medina, Marrakech', 31.6295, -7.9811, ARRAY['cardio', 'weights'], '+212524345678', 'contact@medinagym.ma', true, '00000000-0000-0000-0000-000000000007'),

-- Tangier clubs
('Mediterranean Wellness', 'PREMIUM', 'Tangier', 'Malabata, Tangier', 35.7473, -5.8342, ARRAY['cardio', 'weights', 'spa', 'pool', 'yoga'], '+212539123456', 'info@medwellness.ma', true, '00000000-0000-0000-0000-000000000008'),

-- Agadir clubs
('Beachside Fitness Agadir', 'STANDARD', 'Agadir', 'Beach Road, Agadir', 30.4278, -9.5981, ARRAY['cardio', 'weights', 'outdoor', 'beach_access'], '+212528123456', 'info@beachfitness.ma', true, '00000000-0000-0000-0000-000000000009'),

('Surf & Fitness Club', 'PREMIUM', 'Agadir', 'Marina, Agadir', 30.4202, -9.5982, ARRAY['cardio', 'weights', 'surf', 'yoga', 'outdoor'], '+212528234567', 'info@surffit.ma', true, '00000000-0000-0000-0000-000000000010'),

-- Fez clubs
('Imperial Fitness Fez', 'STANDARD', 'Fez', 'Fes el-Bali, Fez', 34.0331, -5.0003, ARRAY['cardio', 'weights', 'group_classes'], '+212535123456', 'info@imperialfitness.ma', true, '00000000-0000-0000-0000-000000000011'),

('Luxury Gym Fez', 'LUXURY', 'Fez', 'Fes el-Jdid, Fez', 34.0528, -4.9844, ARRAY['cardio', 'weights', 'spa', 'personal_training', 'pool', 'sauna'], '+212535234567', 'contact@luxurygym.ma', true, '00000000-0000-0000-0000-000000000012')

ON CONFLICT (name) DO NOTHING;

-- Verify the clubs were inserted
SELECT 
  name, 
  tier, 
  city, 
  is_active,
  created_at
FROM clubs 
WHERE is_active = true 
ORDER BY city, tier;

-- Show count by tier
SELECT 
  tier,
  COUNT(*) as club_count
FROM clubs 
WHERE is_active = true 
GROUP BY tier 
ORDER BY tier;
