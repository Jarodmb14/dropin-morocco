-- Drop-In Morocco: Database Schema Updates - STEP 1
-- Run this FIRST, then run step 2 after it completes

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

-- 7. Add PARTNER to user_role enum (MUST BE COMMITTED BEFORE USING)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'PARTNER' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
    ) THEN
        ALTER TYPE user_role ADD VALUE 'PARTNER';
    END IF;
END $$;

-- 8. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_partner_status ON orders(partner_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_paid_date ON orders(paid_at) WHERE status = 'PAID';
CREATE INDEX IF NOT EXISTS idx_qr_codes_expires ON qr_codes(expires_at) WHERE status = 'ACTIVE';
CREATE INDEX IF NOT EXISTS idx_checkins_user_venue ON checkins(user_id, club_id);
CREATE INDEX IF NOT EXISTS idx_reviews_venue_rating ON reviews(venue_id, rating);

-- Enable RLS on new tables
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_payouts ENABLE ROW LEVEL SECURITY;

SELECT 'Step 1 completed! Now run schema-updates-step2.sql' as result;
