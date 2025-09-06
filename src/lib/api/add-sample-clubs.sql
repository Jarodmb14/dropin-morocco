-- Add Sample Clubs for Testing - EXTENDED VERSION
-- Run this in your Supabase SQL Editor to add test clubs
-- NOTE: Run add-description-column.sql first to add the description column

-- Insert Sample Clubs (with description column) - 30+ clubs across Morocco
INSERT INTO clubs (name, description, tier, city, address, latitude, longitude, amenities, contact_phone, contact_email, is_active, owner_id) VALUES
-- CASABLANCA (8 clubs)
('FitZone Casablanca', 'Modern fitness center in the heart of Casablanca with state-of-the-art equipment and professional trainers', 'STANDARD', 'Casablanca', 'Boulevard Mohammed V, Casablanca', 33.5731, -7.5898, to_jsonb(ARRAY['cardio', 'weights', 'group_classes']), '+212522123456', 'info@fitzone-casa.ma', true, '00000000-0000-0000-0000-000000000001'),

('Premium Gym Casa', 'Luxury fitness experience with personal trainers, spa services, and premium amenities in the heart of Maarif', 'PREMIUM', 'Casablanca', 'Maarif, Casablanca', 33.5792, -7.6187, to_jsonb(ARRAY['cardio', 'weights', 'spa', 'personal_training', 'pool']), '+212522234567', 'contact@premiumgym.ma', true, '00000000-0000-0000-0000-000000000002'),

('Basic Fitness Center', 'Affordable gym with essential equipment and friendly atmosphere for everyday fitness', 'BASIC', 'Casablanca', 'Derb Ghallef, Casablanca', 33.5650, -7.6034, to_jsonb(ARRAY['cardio', 'weights']), '+212522345678', 'info@basicfitness.ma', true, '00000000-0000-0000-0000-000000000003'),

('Elite Sports Club', 'High-end sports facility with tennis courts, swimming pool, and comprehensive fitness programs', 'ULTRA_LUXE', 'Casablanca', 'Anfa, Casablanca', 33.5589, -7.6678, to_jsonb(ARRAY['cardio', 'weights', 'tennis', 'swimming', 'spa', 'personal_training']), '+212522456789', 'info@elitesports.ma', true, '00000000-0000-0000-0000-000000000004'),

('PowerHouse Gym', 'Heavy lifting focused gym with professional powerlifting equipment and strongman training', 'STANDARD', 'Casablanca', 'Hay Mohammadi, Casablanca', 33.5723, -7.6123, to_jsonb(ARRAY['weights', 'powerlifting', 'strongman', 'cardio']), '+212522567890', 'contact@powerhouse.ma', true, '00000000-0000-0000-0000-000000000005'),

('Women\'s Fitness Studio', 'Exclusive women-only gym with specialized programs and female trainers', 'STANDARD', 'Casablanca', 'Ain Diab, Casablanca', 33.5456, -7.6789, to_jsonb(ARRAY['cardio', 'weights', 'yoga', 'pilates', 'group_classes']), '+212522678901', 'info@womensfitness.ma', true, '00000000-0000-0000-0000-000000000006'),

('CrossFit Casa', 'CrossFit affiliate with certified trainers and functional fitness programs', 'PREMIUM', 'Casablanca', 'Roches Noires, Casablanca', 33.5890, -7.6234, to_jsonb(ARRAY['crossfit', 'weights', 'cardio', 'group_classes']), '+212522789012', 'contact@crossfitcasa.ma', true, '00000000-0000-0000-0000-000000000007'),

('Family Fitness Center', 'Family-friendly gym with kids programs and family memberships', 'BASIC', 'Casablanca', 'Sidi Maarouf, Casablanca', 33.6012, -7.6345, to_jsonb(ARRAY['cardio', 'weights', 'kids_programs', 'family_activities']), '+212522890123', 'info@familyfitness.ma', true, '00000000-0000-0000-0000-000000000008'),

-- RABAT (6 clubs)
('Royal Fitness Rabat', 'Premium gym in the capital city with modern facilities and expert trainers', 'PREMIUM', 'Rabat', 'Agdal, Rabat', 34.0209, -6.8416, to_jsonb(ARRAY['cardio', 'weights', 'spa', 'personal_training']), '+212537123456', 'info@royalfitness.ma', true, '00000000-0000-0000-0000-000000000009'),

('City Gym Rabat', 'Modern gym in downtown Rabat with group classes and personal training options', 'STANDARD', 'Rabat', 'Hassan, Rabat', 34.0134, -6.8480, to_jsonb(ARRAY['cardio', 'weights', 'group_classes']), '+212537234567', 'contact@citygym.ma', true, '00000000-0000-0000-0000-000000000010'),

('Parliament Fitness', 'Government district gym with professional atmosphere and executive programs', 'PREMIUM', 'Rabat', 'Centre Ville, Rabat', 34.0256, -6.8567, to_jsonb(ARRAY['cardio', 'weights', 'spa', 'personal_training', 'executive_programs']), '+212537345678', 'info@parliamentfitness.ma', true, '00000000-0000-0000-0000-000000000011'),

('Student Gym Rabat', 'Affordable gym for students and young professionals with flexible hours', 'BASIC', 'Rabat', 'Agdal, Rabat', 34.0156, -6.8456, to_jsonb(ARRAY['cardio', 'weights', 'student_discounts']), '+212537456789', 'contact@studentgym.ma', true, '00000000-0000-0000-0000-000000000012'),

('Marina Fitness', 'Coastal gym with ocean views and outdoor training areas', 'STANDARD', 'Rabat', 'Salé, Rabat', 34.0456, -6.8234, to_jsonb(ARRAY['cardio', 'weights', 'outdoor', 'ocean_view']), '+212537567890', 'info@marinafitness.ma', true, '00000000-0000-0000-0000-000000000013'),

('Diplomatic Club', 'Exclusive gym for diplomatic community with international standards', 'ULTRA_LUXE', 'Rabat', 'Souissi, Rabat', 34.0123, -6.8345, to_jsonb(ARRAY['cardio', 'weights', 'spa', 'personal_training', 'international_programs']), '+212537678901', 'contact@diplomaticclub.ma', true, '00000000-0000-0000-0000-000000000014'),

-- MARRAKECH (6 clubs)
('Atlas Fitness Marrakech', 'Modern gym with mountain views and comprehensive fitness programs', 'STANDARD', 'Marrakech', 'Gueliz, Marrakech', 31.6348, -8.0099, to_jsonb(ARRAY['cardio', 'weights', 'group_classes']), '+212524234567', 'info@atlasfitness.ma', true, '00000000-0000-0000-0000-000000000015'),

('Medina Gym', 'Traditional gym in the heart of old Marrakech with authentic atmosphere', 'BASIC', 'Marrakech', 'Medina, Marrakech', 31.6295, -7.9811, to_jsonb(ARRAY['cardio', 'weights']), '+212524345678', 'contact@medinagym.ma', true, '00000000-0000-0000-0000-000000000016'),

('Palace Fitness', 'Luxury gym in historic palace with traditional architecture and modern equipment', 'ULTRA_LUXE', 'Marrakech', 'Hivernage, Marrakech', 31.6234, -7.9956, to_jsonb(ARRAY['cardio', 'weights', 'spa', 'personal_training', 'palace_atmosphere']), '+212524456789', 'info@palacefitness.ma', true, '00000000-0000-0000-0000-000000000017'),

('Desert CrossFit', 'CrossFit gym with desert-themed workouts and outdoor training', 'PREMIUM', 'Marrakech', 'Agdal, Marrakech', 31.6456, -8.0123, to_jsonb(ARRAY['crossfit', 'weights', 'cardio', 'outdoor', 'desert_training']), '+212524567890', 'contact@desertcrossfit.ma', true, '00000000-0000-0000-0000-000000000018'),

('Tourist Fitness', 'Gym catering to tourists with flexible day passes and English-speaking staff', 'STANDARD', 'Marrakech', 'Jemaa el-Fnaa, Marrakech', 31.6256, -7.9890, to_jsonb(ARRAY['cardio', 'weights', 'day_passes', 'tourist_friendly']), '+212524678901', 'info@touristfitness.ma', true, '00000000-0000-0000-0000-000000000019'),

('Berber Fitness', 'Traditional Berber-inspired gym with cultural fitness programs', 'BASIC', 'Marrakech', 'Kasbah, Marrakech', 31.6123, -7.9789, to_jsonb(ARRAY['cardio', 'weights', 'cultural_programs']), '+212524789012', 'contact@berberfitness.ma', true, '00000000-0000-0000-0000-000000000020'),

-- TANGIER (4 clubs)
('Mediterranean Wellness', 'Coastal wellness center overlooking the strait with spa and yoga facilities', 'PREMIUM', 'Tangier', 'Malabata, Tangier', 35.7473, -5.8342, to_jsonb(ARRAY['cardio', 'weights', 'spa', 'pool', 'yoga']), '+212539123456', 'info@medwellness.ma', true, '00000000-0000-0000-0000-000000000021'),

('Strait Fitness', 'Modern gym with views of the Strait of Gibraltar and international clientele', 'STANDARD', 'Tangier', 'Centre Ville, Tangier', 35.7567, -5.8234, to_jsonb(ARRAY['cardio', 'weights', 'group_classes', 'international']), '+212539234567', 'contact@straitfitness.ma', true, '00000000-0000-0000-0000-000000000022'),

('Port Gym', 'Industrial-style gym near the port with heavy equipment and strongman training', 'BASIC', 'Tangier', 'Port Area, Tangier', 35.7456, -5.8123, to_jsonb(ARRAY['weights', 'strongman', 'cardio']), '+212539345678', 'info@portgym.ma', true, '00000000-0000-0000-0000-000000000023'),

('European Fitness', 'European-style fitness center with modern equipment and European standards', 'PREMIUM', 'Tangier', 'European Quarter, Tangier', 35.7345, -5.8012, to_jsonb(ARRAY['cardio', 'weights', 'spa', 'personal_training', 'european_standards']), '+212539456789', 'contact@europeanfitness.ma', true, '00000000-0000-0000-0000-000000000024'),

-- AGADIR (4 clubs)
('Beachside Fitness Agadir', 'Oceanfront gym with outdoor training areas and beach access', 'STANDARD', 'Agadir', 'Beach Road, Agadir', 30.4278, -9.5981, to_jsonb(ARRAY['cardio', 'weights', 'outdoor', 'beach_access']), '+212528123456', 'info@beachfitness.ma', true, '00000000-0000-0000-0000-000000000025'),

('Surf & Fitness Club', 'Unique surf and fitness combination center with outdoor training', 'PREMIUM', 'Agadir', 'Marina, Agadir', 30.4202, -9.5982, to_jsonb(ARRAY['cardio', 'weights', 'surf', 'yoga', 'outdoor']), '+212528234567', 'info@surffit.ma', true, '00000000-0000-0000-0000-000000000026'),

('Mountain Fitness', 'Gym with mountain views and hiking-focused fitness programs', 'STANDARD', 'Agadir', 'Haut Agadir, Agadir', 30.4567, -9.6123, to_jsonb(ARRAY['cardio', 'weights', 'hiking', 'mountain_training']), '+212528345678', 'contact@mountainfitness.ma', true, '00000000-0000-0000-0000-000000000027'),

('Resort Fitness', 'Luxury resort-style gym with spa services and vacation packages', 'ULTRA_LUXE', 'Agadir', 'Resort Area, Agadir', 30.4123, -9.5890, to_jsonb(ARRAY['cardio', 'weights', 'spa', 'personal_training', 'resort_amenities']), '+212528456789', 'info@resortfitness.ma', true, '00000000-0000-0000-0000-000000000028'),

-- FEZ (4 clubs)
('Imperial Fitness Fez', 'Traditional gym in the imperial city with modern equipment', 'STANDARD', 'Fez', 'Fes el-Bali, Fez', 34.0331, -5.0003, to_jsonb(ARRAY['cardio', 'weights', 'group_classes']), '+212535123456', 'info@imperialfitness.ma', true, '00000000-0000-0000-0000-000000000029'),

('Luxury Gym Fez', 'High-end fitness center with premium amenities including spa and sauna', 'ULTRA_LUXE', 'Fez', 'Fes el-Jdid, Fez', 34.0528, -4.9844, to_jsonb(ARRAY['cardio', 'weights', 'spa', 'personal_training', 'pool', 'sauna']), '+212535234567', 'contact@luxurygym.ma', true, '00000000-0000-0000-0000-000000000030'),

('University Gym Fez', 'Student-focused gym with affordable rates and flexible schedules', 'BASIC', 'Fez', 'University Area, Fez', 34.0456, -4.9956, to_jsonb(ARRAY['cardio', 'weights', 'student_programs']), '+212535345678', 'info@universitygym.ma', true, '00000000-0000-0000-0000-000000000031'),

('Heritage Fitness', 'Gym preserving traditional fitness methods with modern equipment', 'STANDARD', 'Fez', 'Medina, Fez', 34.0234, -5.0123, to_jsonb(ARRAY['cardio', 'weights', 'traditional_methods']), '+212535456789', 'contact@heritagefitness.ma', true, '00000000-0000-0000-0000-000000000032'),

-- MEKNES (2 clubs)
('Royal City Fitness', 'Fitness center in the royal city with historic atmosphere and modern equipment', 'STANDARD', 'Meknes', 'Centre Ville, Meknes', 33.8935, -5.5473, to_jsonb(ARRAY['cardio', 'weights', 'group_classes']), '+212555123456', 'info@royalcityfitness.ma', true, '00000000-0000-0000-0000-000000000033'),

('Agricultural Fitness', 'Gym serving the agricultural community with practical fitness programs', 'BASIC', 'Meknes', 'Agricultural Area, Meknes', 33.9123, -5.5345, to_jsonb(ARRAY['cardio', 'weights', 'practical_training']), '+212555234567', 'contact@agriculturalfitness.ma', true, '00000000-0000-0000-0000-000000000034'),

-- OUJDA (2 clubs)
('Eastern Fitness', 'Gym in eastern Morocco with modern facilities and regional programs', 'STANDARD', 'Oujda', 'Centre Ville, Oujda', 34.6814, -1.9086, to_jsonb(ARRAY['cardio', 'weights', 'group_classes']), '+212536123456', 'info@easternfitness.ma', true, '00000000-0000-0000-0000-000000000035'),

('Border Fitness', 'Gym near the Algerian border serving international clientele', 'PREMIUM', 'Oujda', 'Border Area, Oujda', 34.6923, -1.8956, to_jsonb(ARRAY['cardio', 'weights', 'spa', 'international']), '+212536234567', 'contact@borderfitness.ma', true, '00000000-0000-0000-0000-000000000036'),

-- TETOUAN (2 clubs)
('Rif Fitness', 'Gym in the Rif mountains with mountain-focused training programs', 'STANDARD', 'Tetouan', 'Centre Ville, Tetouan', 35.5889, -5.3626, to_jsonb(ARRAY['cardio', 'weights', 'mountain_training']), '+212539567890', 'info@riffitness.ma', true, '00000000-0000-0000-0000-000000000037'),

('Andalusian Fitness', 'Gym with Andalusian architecture and cultural fitness programs', 'BASIC', 'Tetouan', 'Medina, Tetouan', 35.5767, -5.3789, to_jsonb(ARRAY['cardio', 'weights', 'cultural_programs']), '+212539678901', 'contact@andalusianfitness.ma', true, '00000000-0000-0000-0000-000000000038'),

-- KENITRA (2 clubs)
('Port Fitness', 'Gym near the port with industrial training and maritime programs', 'STANDARD', 'Kenitra', 'Port Area, Kenitra', 34.2611, -6.5802, to_jsonb(ARRAY['cardio', 'weights', 'industrial_training']), '+212537789012', 'info@portfitness.ma', true, '00000000-0000-0000-0000-000000000039'),

('Military Fitness', 'Gym serving military personnel with specialized training programs', 'PREMIUM', 'Kenitra', 'Military Base, Kenitra', 34.2456, -6.5923, to_jsonb(ARRAY['cardio', 'weights', 'military_training', 'specialized']), '+212537890123', 'contact@militaryfitness.ma', true, '00000000-0000-0000-0000-000000000040'),

-- SAFI (1 club)
('Coastal Fitness Safi', 'Coastal gym with ocean views and fishing community programs', 'BASIC', 'Safi', 'Port Area, Safi', 32.2989, -9.2378, to_jsonb(ARRAY['cardio', 'weights', 'coastal_training']), '+212524901234', 'info@coastalfitness.ma', true, '00000000-0000-0000-0000-000000000041'),

-- EL JADIDA (1 club)
('Portuguese Fitness', 'Gym in historic Portuguese city with cultural fitness programs', 'STANDARD', 'El Jadida', 'Centre Ville, El Jadida', 33.2311, -8.5008, to_jsonb(ARRAY['cardio', 'weights', 'cultural_programs']), '+212523012345', 'contact@portuguesefitness.ma', true, '00000000-0000-0000-0000-000000000042')

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
