# Enhanced Users System Setup Guide

## Overview
The Enhanced Users System extends the existing `profiles` table with comprehensive fields for both customers and gym owners, including credit management, business information, and dashboard analytics.

## Features

### 👥 **Customer Features**
- **Personal Information**: Date of birth, gender, emergency contacts
- **Fitness Profile**: Fitness level, preferred activities
- **Credit System**: Total credits, used credits, available credits
- **Membership Management**: Active, suspended, cancelled status
- **Dashboard Analytics**: Booking history, review count, activity stats

### 🏢 **Gym Owner Features**
- **Business Information**: Business name, registration, address, contact details
- **Banking Details**: Secure bank account information storage
- **Verification System**: Pending, verified, rejected status
- **Dashboard Analytics**: Club count, booking revenue, performance metrics

### 🔧 **Common Features**
- **Profile Management**: Bio, profile picture, language preferences
- **Notification Settings**: Email, SMS, push notification preferences
- **Activity Tracking**: Last login, terms acceptance, privacy consent
- **Role-Based Access**: Customer, Club Owner, Admin roles

## Setup Instructions

### 1. Run the Database Migration

```sql
-- Copy and run: src/lib/api/enhanced-users-schema.sql
```

This script will:
- ✅ Add 20+ new columns to the existing `profiles` table
- ✅ Create performance indexes
- ✅ Add credit management functions
- ✅ Create dashboard views
- ✅ Set up RLS policies
- ✅ Add sample test data

### 2. Test the System

Visit: `http://localhost:5178/users-test`

**Test Features:**
- ✅ Load user profiles by ID
- ✅ View customer dashboard with booking stats
- ✅ View gym owner dashboard with revenue data
- ✅ Update profile information
- ✅ Manage user credits (add/subtract)
- ✅ Update last login timestamp

### 3. API Usage Examples

```typescript
import { UsersAPI } from './lib/api/users';

// Get user profile
const profile = await UsersAPI.getUserProfile('user-id');

// Update profile
const updated = await UsersAPI.updateProfile('user-id', {
  full_name: 'New Name',
  bio: 'Updated bio',
  preferred_language: 'ar'
});

// Manage credits
const success = await UsersAPI.updateCredits({
  user_id: 'user-id',
  amount: 10,
  operation: 'ADD',
  reason: 'Welcome bonus'
});

// Get dashboard data
const dashboard = await UsersAPI.getCustomerDashboard('user-id');
const ownerDashboard = await UsersAPI.getGymOwnerDashboard('owner-id');
```

## Database Schema

### Enhanced Profiles Table

```sql
-- Core fields (existing)
id UUID PRIMARY KEY
full_name TEXT
email TEXT
phone TEXT
role user_role ENUM
country TEXT
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ

-- Customer-specific fields
date_of_birth DATE
gender VARCHAR(10) -- MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
emergency_contact JSONB
fitness_level VARCHAR(20) -- BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
preferred_activities TEXT[]
membership_status VARCHAR(20) -- ACTIVE, SUSPENDED, CANCELLED
total_credits INTEGER DEFAULT 0
used_credits INTEGER DEFAULT 0

-- Gym owner-specific fields
business_name VARCHAR(255)
business_registration VARCHAR(100)
business_address TEXT
business_phone VARCHAR(20)
business_email VARCHAR(255)
bank_account_info JSONB
verification_status VARCHAR(20) -- PENDING, VERIFIED, REJECTED

-- Common fields
profile_picture_url TEXT
bio TEXT
preferred_language VARCHAR(10) -- en, fr, ar, es
notification_preferences JSONB
last_login_at TIMESTAMPTZ
is_active BOOLEAN DEFAULT true
terms_accepted_at TIMESTAMPTZ
privacy_accepted_at TIMESTAMPTZ
```

### Database Functions

#### `get_user_profile(user_id UUID)`
Returns complete user profile with all fields.

#### `update_user_credits(user_id UUID, credit_change INTEGER, operation TEXT)`
Updates user credits with validation.

#### `get_gym_owner_with_clubs(owner_id UUID)`
Returns gym owner profile with associated clubs.

### Database Views

#### `customer_dashboard`
Aggregated customer statistics including:
- Total bookings
- Completed bookings
- Available credits
- Review count

#### `gym_owner_dashboard`
Aggregated gym owner statistics including:
- Total clubs
- Active clubs
- Total revenue
- Booking counts

## Security Features

### Row Level Security (RLS)
- ✅ Users can view/update their own profiles
- ✅ Gym owners can view customer profiles
- ✅ Admins can view all profiles
- ✅ Secure credit management functions

### Data Validation
- ✅ Enum constraints for status fields
- ✅ Credit validation (no negative credits)
- ✅ Required field validation
- ✅ JSON schema validation for preferences

## Integration Points

### With Existing Systems
- ✅ **Reviews System**: Links to user profiles
- ✅ **PostGIS Location**: User location preferences
- ✅ **Authentication**: Supabase auth integration
- ✅ **Orders/Bookings**: Credit deduction on bookings

### Future Integrations
- 🔄 **Stripe Payments**: Credit purchase system
- 🔄 **QR Codes**: User access validation
- 🔄 **Notifications**: Preference-based messaging
- 🔄 **Analytics**: User behavior tracking

## Testing

### Sample Data
The migration does NOT include sample data to avoid foreign key conflicts with `auth.users`. 

To add sample data:
1. Create users in the auth system first (via signup/login)
2. Get their UUIDs: `SELECT id, email FROM auth.users;`
3. Run: `src/lib/api/sample-users-data.sql` (after replacing UUIDs)

Sample users available:
- **Customer**: Ahmed Benali (Casablanca, 50 credits)
- **Gym Owner**: Fatima Alami (Elite Fitness Center, verified)

### Test Scenarios
1. **Profile Management**: Update personal information
2. **Credit System**: Add/subtract credits with validation
3. **Dashboard Views**: Verify aggregated statistics
4. **Role-Based Access**: Test customer vs owner views
5. **Security**: Verify RLS policies work correctly

## Next Steps

After setting up the Enhanced Users System:

1. **📋 Bookings Table** - Complete booking system with status tracking
2. **📱 QR Codes System** - Generation and validation for gym access
3. **💳 Stripe Integration** - Payment processing for credit purchases
4. **🔗 Database Relationships** - Foreign keys and constraints
5. **🔒 Enhanced RLS Policies** - Advanced security rules

## Troubleshooting

### Common Issues

**Error: Column already exists**
- The migration uses `IF NOT EXISTS` checks
- Safe to run multiple times

**Error: Function already exists**
- Functions are created with `CREATE OR REPLACE`
- No conflicts expected

**Error: RLS policy conflicts**
- Policies are dropped before recreation
- Should work without issues

### Verification Steps

1. Check profiles table has new columns:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;
```

2. Test user profile function:
```sql
SELECT * FROM get_user_profile('your-user-id');
```

3. Verify dashboard views:
```sql
SELECT * FROM customer_dashboard LIMIT 1;
SELECT * FROM gym_owner_dashboard LIMIT 1;
```

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify the SQL migration completed successfully
3. Test with the provided sample data
4. Review the RLS policies if access is denied

The Enhanced Users System provides a solid foundation for the complete Drop-In Morocco platform! 🚀
