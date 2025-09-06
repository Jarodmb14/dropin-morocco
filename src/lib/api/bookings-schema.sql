-- Bookings Table Schema for Drop-In Morocco
-- This creates the core booking system connecting users, gyms, and credits

-- Step 1: Create booking status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM (
      'PENDING',      -- Booking created, waiting for confirmation
      'CONFIRMED',    -- Booking confirmed by gym owner
      'ACTIVE',       -- User is currently at the gym
      'COMPLETED',    -- User has finished their session
      'CANCELLED',    -- Booking was cancelled
      'NO_SHOW',      -- User didn't show up
      'EXPIRED'       -- Booking expired without action
    );
  END IF;
END $$;

-- Step 2: Create booking type enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_type') THEN
    CREATE TYPE booking_type AS ENUM (
      'SINGLE_SESSION',    -- One-time gym session
      'DAILY_PASS',        -- Full day access
      'WEEKLY_PASS',       -- Weekly access
      'MONTHLY_PASS'       -- Monthly access
    );
  END IF;
END $$;

-- Step 3: Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User and Gym references
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  
  -- Booking details
  booking_type booking_type NOT NULL DEFAULT 'SINGLE_SESSION',
  status booking_status NOT NULL DEFAULT 'PENDING',
  
  -- Timing
  booked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  
  -- Pricing and credits
  credits_required INTEGER NOT NULL DEFAULT 1,
  credits_deducted INTEGER DEFAULT 0,
  price_per_credit DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) DEFAULT 0.00,
  
  -- QR Code and access
  qr_code TEXT UNIQUE,
  qr_code_generated_at TIMESTAMPTZ,
  qr_code_expires_at TIMESTAMPTZ,
  access_granted_at TIMESTAMPTZ,
  
  -- Additional information
  notes TEXT,
  special_requests TEXT,
  equipment_reserved TEXT[], -- Array of equipment IDs or names
  
  -- Payment and billing
  payment_status VARCHAR(20) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
  payment_method VARCHAR(50),
  payment_reference TEXT,
  stripe_payment_intent_id TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES profiles(id),
  cancellation_reason TEXT,
  
  -- Constraints
  CONSTRAINT valid_booking_times CHECK (scheduled_end > scheduled_start),
  CONSTRAINT valid_credits CHECK (credits_required > 0),
  CONSTRAINT valid_amount CHECK (total_amount >= 0)
);

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings (user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_club_id ON bookings (club_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_start ON bookings (scheduled_start);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_end ON bookings (scheduled_end);
CREATE INDEX IF NOT EXISTS idx_bookings_qr_code ON bookings (qr_code);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings (payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON bookings (user_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_club_status ON bookings (club_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_date_range ON bookings (scheduled_start, scheduled_end);

-- Step 5: Create function to generate QR code
CREATE OR REPLACE FUNCTION generate_booking_qr_code(booking_id UUID)
RETURNS TEXT AS $$
DECLARE
  qr_code_text TEXT;
  booking_record RECORD;
BEGIN
  -- Get booking details
  SELECT 
    b.id,
    b.user_id,
    b.club_id,
    c.name as club_name,
    p.full_name as user_name
  INTO booking_record
  FROM bookings b
  JOIN clubs c ON c.id = b.club_id
  JOIN profiles p ON p.id = b.user_id
  WHERE b.id = booking_id;
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  -- Generate QR code text (format: BOOKING:booking_id:timestamp)
  qr_code_text := 'DROPIN:' || booking_record.id::TEXT || ':' || EXTRACT(EPOCH FROM NOW())::TEXT;
  
  -- Update booking with QR code
  UPDATE bookings
  SET 
    qr_code = qr_code_text,
    qr_code_generated_at = NOW(),
    qr_code_expires_at = NOW() + INTERVAL '24 hours',
    updated_at = NOW()
  WHERE id = booking_id;
  
  RETURN qr_code_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create function to validate QR code
CREATE OR REPLACE FUNCTION validate_booking_qr_code(qr_code_input TEXT)
RETURNS TABLE (
  is_valid BOOLEAN,
  booking_id UUID,
  user_id UUID,
  club_id UUID,
  club_name TEXT,
  user_name TEXT,
  status TEXT,
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  credits_required INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN b.qr_code_expires_at > NOW() AND b.status IN ('CONFIRMED', 'ACTIVE') THEN true
      ELSE false
    END as is_valid,
    b.id as booking_id,
    b.user_id,
    b.club_id,
    c.name as club_name,
    p.full_name as user_name,
    b.status::TEXT,
    b.scheduled_start,
    b.scheduled_end,
    b.credits_required
  FROM bookings b
  JOIN clubs c ON c.id = b.club_id
  JOIN profiles p ON p.id = b.user_id
  WHERE b.qr_code = qr_code_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create function to process booking (deduct credits and confirm)
CREATE OR REPLACE FUNCTION process_booking(booking_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  booking_record RECORD;
  user_credits INTEGER;
BEGIN
  -- Get booking details
  SELECT 
    b.*,
    p.total_credits,
    p.used_credits
  INTO booking_record
  FROM bookings b
  JOIN profiles p ON p.id = b.user_id
  WHERE b.id = booking_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check if user has enough credits
  user_credits := booking_record.total_credits - booking_record.used_credits;
  
  IF user_credits < booking_record.credits_required THEN
    RETURN FALSE; -- Insufficient credits
  END IF;
  
  -- Deduct credits from user
  UPDATE profiles
  SET 
    used_credits = used_credits + booking_record.credits_required,
    updated_at = NOW()
  WHERE id = booking_record.user_id;
  
  -- Update booking status
  UPDATE bookings
  SET 
    status = 'CONFIRMED',
    credits_deducted = booking_record.credits_required,
    payment_status = 'PAID',
    updated_at = NOW()
  WHERE id = booking_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Create function to start gym session
CREATE OR REPLACE FUNCTION start_gym_session(booking_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE bookings
  SET 
    status = 'ACTIVE',
    actual_start = NOW(),
    access_granted_at = NOW(),
    updated_at = NOW()
  WHERE id = booking_id 
    AND status = 'CONFIRMED'
    AND scheduled_start <= NOW()
    AND scheduled_end > NOW();
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Create function to end gym session
CREATE OR REPLACE FUNCTION end_gym_session(booking_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE bookings
  SET 
    status = 'COMPLETED',
    actual_end = NOW(),
    updated_at = NOW()
  WHERE id = booking_id 
    AND status = 'ACTIVE';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Create function to cancel booking
CREATE OR REPLACE FUNCTION cancel_booking(
  booking_id UUID,
  cancelled_by_user_id UUID,
  reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  booking_record RECORD;
BEGIN
  -- Get booking details
  SELECT * INTO booking_record
  FROM bookings
  WHERE id = booking_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Only allow cancellation if booking is not completed
  IF booking_record.status IN ('COMPLETED', 'CANCELLED') THEN
    RETURN FALSE;
  END IF;
  
  -- Refund credits if they were deducted
  IF booking_record.credits_deducted > 0 THEN
    UPDATE profiles
    SET 
      used_credits = used_credits - booking_record.credits_deducted,
      updated_at = NOW()
    WHERE id = booking_record.user_id;
  END IF;
  
  -- Update booking status
  UPDATE bookings
  SET 
    status = 'CANCELLED',
    cancelled_at = NOW(),
    cancelled_by = cancelled_by_user_id,
    cancellation_reason = reason,
    updated_at = NOW()
  WHERE id = booking_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 11: Create function to get user bookings
CREATE OR REPLACE FUNCTION get_user_bookings(input_user_id UUID, limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
  booking_id UUID,
  club_id UUID,
  club_name TEXT,
  club_tier TEXT,
  booking_type TEXT,
  status TEXT,
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  credits_required INTEGER,
  credits_deducted INTEGER,
  total_amount DECIMAL(10,2),
  qr_code TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id as booking_id,
    b.club_id,
    c.name as club_name,
    c.tier::TEXT as club_tier,
    b.booking_type::TEXT,
    b.status::TEXT,
    b.scheduled_start,
    b.scheduled_end,
    b.actual_start,
    b.actual_end,
    b.credits_required,
    b.credits_deducted,
    b.total_amount,
    b.qr_code,
    b.created_at
  FROM bookings b
  JOIN clubs c ON c.id = b.club_id
  WHERE b.user_id = input_user_id
  ORDER BY b.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 12: Create function to get club bookings
CREATE OR REPLACE FUNCTION get_club_bookings(input_club_id UUID, limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
  booking_id UUID,
  user_id UUID,
  user_name TEXT,
  user_email TEXT,
  booking_type TEXT,
  status TEXT,
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  credits_required INTEGER,
  credits_deducted INTEGER,
  total_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id as booking_id,
    b.user_id,
    p.full_name as user_name,
    p.email as user_email,
    b.booking_type::TEXT,
    b.status::TEXT,
    b.scheduled_start,
    b.scheduled_end,
    b.actual_start,
    b.actual_end,
    b.credits_required,
    b.credits_deducted,
    b.total_amount,
    b.created_at
  FROM bookings b
  JOIN profiles p ON p.id = b.user_id
  WHERE b.club_id = input_club_id
  ORDER BY b.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 13: Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_booking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_booking_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_updated_at();

-- Step 14: Create RLS policies for bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
DROP POLICY IF EXISTS "Club owners can view their club bookings" ON bookings;
DROP POLICY IF EXISTS "Club owners can update their club bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;

-- Create new RLS policies
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Club owners can view their club bookings" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM clubs 
      WHERE clubs.id = bookings.club_id 
      AND clubs.owner_id = auth.uid()
    )
  );

CREATE POLICY "Club owners can update their club bookings" ON bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM clubs 
      WHERE clubs.id = bookings.club_id 
      AND clubs.owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all bookings" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'ADMIN'
    )
  );

-- Step 15: Update dashboard views to include booking data
-- Update customer dashboard view
CREATE OR REPLACE VIEW customer_dashboard AS
SELECT 
  p.id,
  p.full_name,
  p.email,
  p.phone,
  p.total_credits,
  p.used_credits,
  (p.total_credits - p.used_credits) as available_credits,
  p.membership_status,
  p.fitness_level,
  p.preferred_activities,
  p.last_login_at,
  -- Booking stats
  COUNT(DISTINCT b.id) as total_bookings,
  COUNT(DISTINCT CASE WHEN b.status = 'COMPLETED' THEN b.id END) as completed_bookings,
  COUNT(DISTINCT r.id) as total_reviews
FROM profiles p
LEFT JOIN bookings b ON b.user_id = p.id
LEFT JOIN reviews r ON r.user_id = p.id
WHERE p.role = 'CUSTOMER' AND p.is_active = true
GROUP BY p.id, p.full_name, p.email, p.phone, p.total_credits, p.used_credits, 
         p.membership_status, p.fitness_level, p.preferred_activities, p.last_login_at;

-- Update gym owner dashboard view
CREATE OR REPLACE VIEW gym_owner_dashboard AS
SELECT 
  p.id as owner_id,
  p.full_name as owner_name,
  p.email as owner_email,
  p.business_name,
  p.verification_status,
  COUNT(DISTINCT c.id) as total_clubs,
  COUNT(DISTINCT CASE WHEN c.is_active = true THEN c.id END) as active_clubs,
  -- Booking stats
  COUNT(DISTINCT b.id) as total_bookings,
  COUNT(DISTINCT CASE WHEN b.status = 'COMPLETED' THEN b.id END) as completed_bookings,
  COALESCE(SUM(CASE WHEN b.status = 'COMPLETED' THEN b.total_amount ELSE 0 END), 0) as total_revenue
FROM profiles p
LEFT JOIN clubs c ON c.owner_id = p.id
LEFT JOIN bookings b ON b.club_id = c.id
WHERE p.role = 'CLUB_OWNER' AND p.is_active = true
GROUP BY p.id, p.full_name, p.email, p.business_name, p.verification_status;

-- Step 16: Create view for booking analytics
CREATE OR REPLACE VIEW booking_analytics AS
SELECT 
  DATE(b.created_at) as booking_date,
  COUNT(*) as total_bookings,
  COUNT(CASE WHEN b.status = 'COMPLETED' THEN 1 END) as completed_bookings,
  COUNT(CASE WHEN b.status = 'CANCELLED' THEN 1 END) as cancelled_bookings,
  COUNT(CASE WHEN b.status = 'NO_SHOW' THEN 1 END) as no_show_bookings,
  SUM(b.total_amount) as total_revenue,
  AVG(b.total_amount) as avg_booking_value,
  SUM(b.credits_deducted) as total_credits_used
FROM bookings b
GROUP BY DATE(b.created_at)
ORDER BY booking_date DESC;

-- Success message
SELECT 'Bookings table schema implemented successfully!' as result;
