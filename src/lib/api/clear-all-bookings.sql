-- Clear all bookings from the database
-- WARNING: This will delete ALL bookings permanently!

-- First, let's see how many bookings we have
SELECT COUNT(*) as total_bookings FROM bookings;

-- Delete all bookings
DELETE FROM bookings;

-- Verify they're all gone
SELECT COUNT(*) as remaining_bookings FROM bookings;

-- Optional: Reset any sequences if needed
-- ALTER SEQUENCE bookings_id_seq RESTART WITH 1;
