-- Create clubs table for Drop-In Morocco
-- This table stores gym/club information

CREATE TABLE IF NOT EXISTS clubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  tier club_tier NOT NULL DEFAULT 'BASIC',
  city VARCHAR(100) NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  amenities JSONB DEFAULT '[]'::jsonb,
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  auto_blane_price DECIMAL(10, 2) DEFAULT 50.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clubs_city ON clubs(city);
CREATE INDEX IF NOT EXISTS idx_clubs_tier ON clubs(tier);
CREATE INDEX IF NOT EXISTS idx_clubs_active ON clubs(is_active);
CREATE INDEX IF NOT EXISTS idx_clubs_owner ON clubs(owner_id);
CREATE INDEX IF NOT EXISTS idx_clubs_location ON clubs(latitude, longitude);

-- Enable RLS (Row Level Security)
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Anyone can read active clubs
CREATE POLICY "Anyone can view active clubs" ON clubs
  FOR SELECT USING (is_active = true);

-- Club owners can view their own clubs
CREATE POLICY "Club owners can view their own clubs" ON clubs
  FOR SELECT USING (auth.uid() = owner_id);

-- Club owners can update their own clubs
CREATE POLICY "Club owners can update their own clubs" ON clubs
  FOR UPDATE USING (auth.uid() = owner_id);

-- Club owners can insert clubs
CREATE POLICY "Club owners can insert clubs" ON clubs
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Admins can do everything
CREATE POLICY "Admins can manage all clubs" ON clubs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'ADMIN'
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_clubs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clubs_updated_at
  BEFORE UPDATE ON clubs
  FOR EACH ROW
  EXECUTE FUNCTION update_clubs_updated_at();

-- Insert some sample clubs for testing
INSERT INTO clubs (name, description, tier, city, address, latitude, longitude, amenities, contact_phone, contact_email, is_active, owner_id, auto_blane_price) VALUES
('FitZone Casablanca', 'Modern fitness center in the heart of Casablanca with state-of-the-art equipment and professional trainers', 'STANDARD', 'Casablanca', 'Boulevard Mohammed V, Casablanca', 33.5731, -7.5898, '["cardio", "weights", "group_classes"]'::jsonb, '+212522123456', 'info@fitzone-casa.ma', true, (SELECT id FROM profiles WHERE role = 'ADMIN' LIMIT 1), 50.00),
('Premium Gym Casa', 'Luxury fitness experience with personal trainers, spa services, and premium amenities in the heart of Maarif', 'PREMIUM', 'Casablanca', 'Maarif, Casablanca', 33.5792, -7.6187, '["cardio", "weights", "spa", "personal_training", "pool"]'::jsonb, '+212522234567', 'contact@premiumgym.ma', true, (SELECT id FROM profiles WHERE role = 'ADMIN' LIMIT 1), 75.00),
('Basic Fitness Center', 'Affordable gym with essential equipment and friendly atmosphere for everyday fitness', 'BASIC', 'Casablanca', 'Derb Ghallef, Casablanca', 33.5650, -7.6034, '["cardio", "weights"]'::jsonb, '+212522345678', 'info@basicfitness.ma', true, (SELECT id FROM profiles WHERE role = 'ADMIN' LIMIT 1), 30.00),
('Elite Sports Club', 'High-end sports facility with tennis courts, swimming pool, and comprehensive fitness programs', 'ULTRA_LUXE', 'Casablanca', 'Anfa, Casablanca', 33.5589, -7.6678, '["cardio", "weights", "tennis", "swimming", "spa", "personal_training"]'::jsonb, '+212522456789', 'info@elitesports.ma', true, (SELECT id FROM profiles WHERE role = 'ADMIN' LIMIT 1), 100.00),
('Royal Fitness Rabat', 'Premium gym in the capital city with modern facilities and expert trainers', 'PREMIUM', 'Rabat', 'Agdal, Rabat', 34.0209, -6.8416, '["cardio", "weights", "spa", "personal_training"]'::jsonb, '+212537123456', 'info@royalfitness.ma', true, (SELECT id FROM profiles WHERE role = 'ADMIN' LIMIT 1), 70.00),
('Atlas Fitness Marrakech', 'Modern gym with mountain views and comprehensive fitness programs', 'STANDARD', 'Marrakech', 'Gueliz, Marrakech', 31.6348, -8.0099, '["cardio", "weights", "group_classes"]'::jsonb, '+212524234567', 'info@atlasfitness.ma', true, (SELECT id FROM profiles WHERE role = 'ADMIN' LIMIT 1), 55.00),
('Mediterranean Wellness', 'Coastal wellness center overlooking the strait with spa and yoga facilities', 'PREMIUM', 'Tangier', 'Malabata, Tangier', 35.7473, -5.8342, '["cardio", "weights", "spa", "pool", "yoga"]'::jsonb, '+212539123456', 'info@medwellness.ma', true, (SELECT id FROM profiles WHERE role = 'ADMIN' LIMIT 1), 80.00),
('Beachside Fitness Agadir', 'Oceanfront gym with outdoor training areas and beach access', 'STANDARD', 'Agadir', 'Beach Road, Agadir', 30.4278, -9.5981, '["cardio", "weights", "outdoor", "beach_access"]'::jsonb, '+212528123456', 'info@beachfitness.ma', true, (SELECT id FROM profiles WHERE role = 'ADMIN' LIMIT 1), 60.00);

-- Verify the clubs were created
SELECT 
  name, 
  tier, 
  city, 
  is_active,
  auto_blane_price
FROM clubs 
WHERE is_active = true 
ORDER BY city, tier;
