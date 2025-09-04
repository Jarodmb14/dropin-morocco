-- Drop-In Morocco Test Data Setup
-- Run this in your Supabase SQL Editor to populate test data

-- Insert Products (Blane offerings)
INSERT INTO products (name, type, price_mad, credits, tier_scope, is_active) VALUES
-- Single entries for each tier
('Blane Basic', 'SINGLE', 50, 1, ARRAY['BASIC'], true),
('Blane Standard', 'SINGLE', 90, 1, ARRAY['STANDARD'], true),
('Blane Premium', 'SINGLE', 150, 1, ARRAY['PREMIUM'], true),
('Blane Ultra Luxury', 'SINGLE', 320, 1, ARRAY['ULTRA_LUXE'], true),

-- Multi-tier single entries
('Blane Basic+', 'SINGLE', 90, 1, ARRAY['BASIC', 'STANDARD'], true),
('Blane Premium+', 'SINGLE', 200, 1, ARRAY['STANDARD', 'PREMIUM'], true),
('Blane All Access', 'SINGLE', 320, 1, ARRAY['BASIC', 'STANDARD', 'PREMIUM', 'ULTRA_LUXE'], true),

-- Pack 5 entries (10% discount)
('Blane Pack 5 - Basic', 'PACK5', 225, 5, ARRAY['BASIC'], true), -- 50*5*0.9
('Blane Pack 5 - Standard', 'PACK5', 405, 5, ARRAY['STANDARD'], true), -- 90*5*0.9
('Blane Pack 5 - Premium', 'PACK5', 675, 5, ARRAY['PREMIUM'], true), -- 150*5*0.9
('Blane Pack 5 - Multi', 'PACK5', 900, 5, ARRAY['BASIC', 'STANDARD', 'PREMIUM'], true),

-- Pack 10 entries (20% discount)
('Blane Pack 10 - Basic', 'PACK10', 400, 10, ARRAY['BASIC'], true), -- 50*10*0.8
('Blane Pack 10 - Standard', 'PACK10', 720, 10, ARRAY['STANDARD'], true), -- 90*10*0.8
('Blane Pack 10 - Premium', 'PACK10', 1200, 10, ARRAY['PREMIUM'], true), -- 150*10*0.8
('Blane Pack 10 - All Access', 'PACK10', 2560, 10, ARRAY['BASIC', 'STANDARD', 'PREMIUM', 'ULTRA_LUXE'], true),

-- Monthly passes
('Blane Pass Standard', 'PASS_STANDARD', 1200, 999, ARRAY['BASIC', 'STANDARD'], true),
('Blane Pass Premium', 'PASS_PREMIUM', 2000, 999, ARRAY['BASIC', 'STANDARD', 'PREMIUM', 'ULTRA_LUXE'], true)

ON CONFLICT (name) DO NOTHING;

-- Insert Sample Clubs
INSERT INTO clubs (name, description, tier, city, address, latitude, longitude, amenities, contact_phone, contact_email, is_active) VALUES
-- Casablanca clubs
('FitZone Casablanca', 'Modern fitness center in the heart of Casablanca with state-of-the-art equipment', 'STANDARD', 'Casablanca', 'Boulevard Mohammed V, Casablanca', 33.5731, -7.5898, ARRAY['cardio', 'weights', 'group_classes'], '+212522123456', 'info@fitzone-casa.ma', true),

('Premium Gym Casa', 'Luxury fitness experience with personal trainers and spa services', 'PREMIUM', 'Casablanca', 'Maarif, Casablanca', 33.5792, -7.6187, ARRAY['cardio', 'weights', 'spa', 'personal_training', 'pool'], '+212522234567', 'contact@premiumgym.ma', true),

('Basic Fitness Derb Ghallef', 'Affordable gym with essential equipment for everyday workouts', 'BASIC', 'Casablanca', 'Derb Ghallef, Casablanca', 33.5650, -7.6034, ARRAY['cardio', 'weights'], '+212522345678', 'info@basicfitness.ma', true),

('Ultra Spa Resort Casa', 'Exclusive ultra-luxury wellness resort with world-class amenities', 'ULTRA_LUXE', 'Casablanca', 'Corniche Ain Diab, Casablanca', 33.5469, -7.6692, ARRAY['spa', 'pool', 'massage', 'yoga', 'pilates', 'personal_training', 'wellness'], '+212522456789', 'reservations@ultraspa-casa.ma', true),

-- Rabat clubs
('Royal Fitness Rabat', 'Premium fitness center in Morocco''s capital', 'PREMIUM', 'Rabat', 'Agdal, Rabat', 34.0209, -6.8417, ARRAY['cardio', 'weights', 'pool', 'group_classes'], '+212537123456', 'info@royalfitness.ma', true),

('Community Gym Rabat', 'Neighborhood gym with friendly atmosphere', 'BASIC', 'Rabat', 'Hassan, Rabat', 34.0331, -6.8329, ARRAY['cardio', 'weights'], '+212537234567', 'contact@communitygym.ma', true),

-- Marrakech clubs
('Desert Oasis Spa', 'Luxury wellness retreat in the Red City', 'ULTRA_LUXE', 'Marrakech', 'Palmeraie, Marrakech', 31.6695, -8.0113, ARRAY['spa', 'yoga', 'massage', 'pool', 'wellness'], '+212524123456', 'info@desertoasis.ma', true),

('Atlas Fitness Marrakech', 'Modern gym with mountain views', 'STANDARD', 'Marrakech', 'Gueliz, Marrakech', 31.6348, -8.0099, ARRAY['cardio', 'weights', 'group_classes'], '+212524234567', 'info@atlasfitness.ma', true),

('Medina Gym', 'Traditional gym in the heart of old Marrakech', 'BASIC', 'Marrakech', 'Medina, Marrakech', 31.6295, -7.9811, ARRAY['cardio', 'weights'], '+212524345678', 'contact@medinagym.ma', true),

-- Tangier clubs
('Mediterranean Wellness', 'Coastal wellness center overlooking the strait', 'PREMIUM', 'Tangier', 'Malabata, Tangier', 35.7473, -5.8342, ARRAY['cardio', 'weights', 'spa', 'pool', 'yoga'], '+212539123456', 'info@medwellness.ma', true),

-- Agadir clubs
('Beachside Fitness Agadir', 'Oceanfront gym with outdoor training areas', 'STANDARD', 'Agadir', 'Beach Road, Agadir', 30.4278, -9.5981, ARRAY['cardio', 'weights', 'outdoor', 'beach_access'], '+212528123456', 'info@beachfitness.ma', true),

('Surf & Fitness Club', 'Unique surf and fitness combination center', 'PREMIUM', 'Agadir', 'Marina, Agadir', 30.4202, -9.5982, ARRAY['cardio', 'weights', 'surf', 'yoga', 'outdoor'], '+212528234567', 'info@surffit.ma', true)

ON CONFLICT (name) DO NOTHING;

-- Set up club capacity for current date
INSERT INTO club_capacity (club_id, date, max_capacity, current_occupancy)
SELECT 
    c.id,
    CURRENT_DATE,
    CASE 
        WHEN c.tier = 'BASIC' THEN 50
        WHEN c.tier = 'STANDARD' THEN 80
        WHEN c.tier = 'PREMIUM' THEN 120
        WHEN c.tier = 'ULTRA_LUXE' THEN 200
    END as max_capacity,
    floor(random() * 20) as current_occupancy -- Random current occupancy for demo
FROM clubs c
WHERE c.is_active = true
ON CONFLICT (club_id, date) DO NOTHING;

-- Note: The following would require actual user accounts, so we'll skip for now:
-- - Sample orders
-- - Sample QR codes
-- - Sample check-ins
-- - Sample payments

-- You can manually create these through the API once you have user accounts set up

-- Verify the data
SELECT 'Products' as table_name, count(*) as count FROM products
UNION ALL
SELECT 'Clubs' as table_name, count(*) as count FROM clubs  
UNION ALL
SELECT 'Club Capacity' as table_name, count(*) as count FROM club_capacity;

-- Show sample data
SELECT 
    'Sample Products' as info,
    json_agg(json_build_object('name', name, 'type', type, 'price', price_mad, 'tier_scope', tier_scope)) as data
FROM (SELECT * FROM products LIMIT 5) p

UNION ALL

SELECT 
    'Sample Clubs' as info,
    json_agg(json_build_object('name', name, 'tier', tier, 'city', city)) as data
FROM (SELECT * FROM clubs LIMIT 5) c;
