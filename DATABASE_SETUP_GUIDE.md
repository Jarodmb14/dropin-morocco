# 🗄️ Drop-In Morocco Database Setup Guide

## Step 1: Apply Schema Updates in Supabase

1. **Go to your Supabase Dashboard**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your "Drop-in Morocco" project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Run the Schema Updates**
   - Copy the contents from `src/lib/api/schema-updates.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute

## Step 2: Verify Schema Updates

After running the SQL, verify these tables and columns exist:

### ✅ **orders table** (updated)
- `gross_amount` - Total amount before commission
- `commission_amount` - 25% platform commission  
- `net_partner_amount` - 75% partner revenue
- `paid_at` - Payment confirmation timestamp
- `cancelled_at` - Cancellation timestamp
- `partner_id` - Link to partner/club owner

### ✅ **clubs table** (updated)
- `monthly_price` - Monthly subscription price
- `auto_blane_price` - Automatically calculated Blane price

### ✅ **products table** (updated)
- `venue_id` - Link products to specific venues

### ✅ **reviews table** (new)
- User reviews with 1-5 star ratings
- Only users with completed bookings can review

### ✅ **partner_payouts table** (new)
- Partner revenue tracking and payouts
- Commission breakdown by period

## Step 3: Test the Business Rules

Once the schema is updated, we can test:

1. **Automatic Pricing**: Venues get correct Blane prices based on tier
2. **Commission Calculation**: 25% commission, 75% partner revenue
3. **QR Code Security**: Signed codes with expiration
4. **Role-Based Access**: Users only see their data

## 🚨 Important Notes

- The SQL will automatically update existing data
- All existing clubs will get `monthly_price` and `auto_blane_price` 
- RLS policies ensure data security
- Functions are created for automatic calculations

## ⚡ Quick Test

After schema update, you can test by:
1. Creating a venue with different tiers
2. Checking if `auto_blane_price` is calculated correctly:
   - BASIC/STANDARD = 50 DHS
   - PREMIUM = 120 DHS  
   - ULTRA_LUXE = 350 DHS

---

**Ready to proceed?** Let me know when you've applied the schema updates and I'll help you test the business rules! 🚀
