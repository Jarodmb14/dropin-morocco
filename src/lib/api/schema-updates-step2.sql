-- Drop-In Morocco: Database Schema Updates - STEP 2
-- Run this AFTER step 1 has been committed successfully

-- 1. Create functions for business logic

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

-- 2. Row Level Security Policies (now that PARTNER enum value is committed)

-- Reviews policies
DROP POLICY IF EXISTS "Users can view all reviews" ON reviews;
CREATE POLICY "Users can view all reviews" ON reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create reviews for their bookings" ON reviews;
CREATE POLICY "Users can create reviews for their bookings" ON reviews FOR INSERT 
WITH CHECK (
    auth.uid() = user_id 
    AND EXISTS (
        SELECT 1 FROM checkins c 
        WHERE c.user_id = auth.uid() 
        AND c.club_id = venue_id
    )
);

DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can moderate reviews" ON reviews;
CREATE POLICY "Admins can moderate reviews" ON reviews FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- Partner payouts policies
DROP POLICY IF EXISTS "Partners can view their own payouts" ON partner_payouts;
CREATE POLICY "Partners can view their own payouts" ON partner_payouts FOR SELECT 
USING (auth.uid() = partner_id);

DROP POLICY IF EXISTS "Admins can manage all payouts" ON partner_payouts;
CREATE POLICY "Admins can manage all payouts" ON partner_payouts FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- Update existing RLS policies for orders
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT 
USING (auth.uid() = user_id);

-- Now we can safely use PARTNER in policies
DROP POLICY IF EXISTS "Partners can view their venue orders" ON orders;
CREATE POLICY "Partners can view their venue orders" ON orders FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = auth.uid() 
        AND p.role IN ('PARTNER', 'CLUB_OWNER')
        AND p.id = partner_id
    )
);

DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- 3. Sample data update
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

-- Success message
SELECT 'Drop-In Morocco database schema fully updated! 🎉 Ready to test business rules!' as result;
