-- Drop-In Morocco: Database Schema Updates for Business Rules
-- Run these in your Supabase SQL Editor

-- 1. Add business rule fields to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gross_amount DECIMAL(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS commission_amount DECIMAL(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS net_partner_amount DECIMAL(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES profiles(id);

-- 2. Add monthly pricing to clubs table
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS monthly_price DECIMAL(10,2);
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS auto_blane_price DECIMAL(10,2);

-- 3. Add venue relationship to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS venue_id UUID REFERENCES clubs(id);

-- 4. Add QR code fields
ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS signed_data TEXT;

-- 5. Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    venue_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_moderated BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, venue_id, booking_id)
);

-- 6. Create partner payouts table
CREATE TABLE IF NOT EXISTS partner_payouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_bookings INTEGER DEFAULT 0,
    gross_amount DECIMAL(10,2) DEFAULT 0,
    commission_amount DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2) DEFAULT 0,
    payout_status TEXT DEFAULT 'PENDING' CHECK (payout_status IN ('PENDING', 'PROCESSING', 'PAID', 'FAILED')),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Update user roles enum to include PARTNER
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_new') THEN
        CREATE TYPE user_role_new AS ENUM ('CUSTOMER', 'CLUB_OWNER', 'PARTNER', 'ADMIN');
        ALTER TABLE profiles ALTER COLUMN role TYPE user_role_new USING role::text::user_role_new;
        DROP TYPE user_role;
        ALTER TYPE user_role_new RENAME TO user_role;
    END IF;
END $$;

-- 8. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_partner_status ON orders(partner_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_paid_date ON orders(paid_at) WHERE status = 'PAID';
CREATE INDEX IF NOT EXISTS idx_qr_codes_expires ON qr_codes(expires_at) WHERE status = 'ACTIVE';
CREATE INDEX IF NOT EXISTS idx_checkins_user_venue ON checkins(user_id, club_id);
CREATE INDEX IF NOT EXISTS idx_reviews_venue_rating ON reviews(venue_id, rating);

-- 9. Create functions for business logic

-- Function to calculate automatic Blane pricing
CREATE OR REPLACE FUNCTION calculate_blane_pricing(venue_tier club_tier, monthly_price DECIMAL DEFAULT NULL)
RETURNS DECIMAL AS $$
BEGIN
    CASE venue_tier
        WHEN 'BASIC', 'STANDARD' THEN RETURN 50;
        WHEN 'PREMIUM' THEN RETURN 120;
        WHEN 'ULTRA_LUXE' THEN RETURN 350;
        ELSE
            -- Fallback to monthly price logic
            IF monthly_price IS NOT NULL THEN
                IF monthly_price < 400 THEN RETURN 50;
                ELSIF monthly_price <= 800 THEN RETURN 120;
                ELSE RETURN 350;
                END IF;
            ELSE
                RETURN 50; -- Default
            END IF;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to update auto_blane_price when tier or monthly_price changes
CREATE OR REPLACE FUNCTION update_auto_blane_pricing()
RETURNS TRIGGER AS $$
BEGIN
    NEW.auto_blane_price := calculate_blane_pricing(NEW.tier, NEW.monthly_price);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update Blane pricing
DROP TRIGGER IF EXISTS trigger_update_blane_pricing ON clubs;
CREATE TRIGGER trigger_update_blane_pricing
    BEFORE INSERT OR UPDATE ON clubs
    FOR EACH ROW
    EXECUTE FUNCTION update_auto_blane_pricing();

-- Function to calculate commission split
CREATE OR REPLACE FUNCTION calculate_commission_split(gross_amount DECIMAL)
RETURNS TABLE(commission DECIMAL, net_partner DECIMAL) AS $$
BEGIN
    commission := ROUND(gross_amount * 0.25, 2);
    net_partner := gross_amount - commission;
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Function to mark expired QR codes (for cron job)
CREATE OR REPLACE FUNCTION mark_expired_qr_codes()
RETURNS INTEGER AS $$
DECLARE
    expired_count INTEGER;
BEGIN
    UPDATE qr_codes 
    SET status = 'EXPIRED'
    WHERE expires_at < NOW()
    AND status = 'ACTIVE';
    
    GET DIAGNOSTICS expired_count = ROW_COUNT;
    RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

-- 10. Row Level Security Policies

-- Enable RLS on new tables
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_payouts ENABLE ROW LEVEL SECURITY;

-- Reviews policies
CREATE POLICY "Users can view all reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for their bookings" ON reviews FOR INSERT 
WITH CHECK (
    auth.uid() = user_id 
    AND EXISTS (
        SELECT 1 FROM checkins c 
        WHERE c.user_id = auth.uid() 
        AND c.club_id = venue_id
    )
);
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE 
USING (auth.uid() = user_id);
CREATE POLICY "Admins can moderate reviews" ON reviews FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- Partner payouts policies
CREATE POLICY "Partners can view their own payouts" ON partner_payouts FOR SELECT 
USING (auth.uid() = partner_id);
CREATE POLICY "Admins can manage all payouts" ON partner_payouts FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- Update existing RLS policies for orders
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Partners can view their venue orders" ON orders FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = auth.uid() 
        AND p.role IN ('PARTNER', 'CLUB_OWNER')
        AND p.id = partner_id
    )
);

CREATE POLICY "Admins can view all orders" ON orders FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- 11. Sample data update
-- Update existing clubs with auto pricing
UPDATE clubs SET 
    monthly_price = CASE 
        WHEN tier = 'BASIC' THEN 300
        WHEN tier = 'STANDARD' THEN 500  
        WHEN tier = 'PREMIUM' THEN 700
        WHEN tier = 'ULTRA_LUXE' THEN 1200
    END
WHERE monthly_price IS NULL;

-- This will trigger the auto_blane_price calculation
UPDATE clubs SET tier = tier WHERE auto_blane_price IS NULL;
