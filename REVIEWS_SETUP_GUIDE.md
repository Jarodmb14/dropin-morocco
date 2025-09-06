# Reviews & Ratings System Setup Guide

## 🎯 Overview

This guide will help you set up the comprehensive reviews and ratings system for Drop-In Morocco. The system allows customers to rate and review gyms after their visits, with detailed rating breakdowns and helpful voting.

## 📋 Features

### ✅ **Core Features:**
- **Overall Rating** (1-5 stars)
- **Detailed Ratings** (Cleanliness, Equipment, Staff, Value, Atmosphere)
- **Review Comments** with titles
- **Verified Reviews** (only for paid bookings)
- **Helpful Voting** system
- **Rating Distribution** charts
- **Automatic Rating Updates** for clubs

### ✅ **Security Features:**
- **Row Level Security (RLS)** policies
- **Verified Reviews Only** (must have paid booking)
- **One Review Per Booking** limit
- **User Authentication** required

## 🚀 Setup Instructions

### **Step 1: Run Database Migration**

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to **SQL Editor**

2. **Run the Migration Script**
   ```sql
   -- Copy and paste the entire content of src/lib/api/reviews-schema.sql
   -- This will create all necessary tables, functions, and policies
   ```

3. **Verify Tables Created**
   - Check that these tables exist:
     - `reviews`
     - `review_helpful`
   - Check that `clubs` table has new columns:
     - `average_rating`
     - `total_reviews`
     - `rating_breakdown`

### **Step 2: Test the System**

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Visit Test Page**
   - Go to `http://localhost:5181/reviews-test`
   - Test different clubs and review functionality

3. **Test API Functions**
   - Use the API test buttons on the test page
   - Verify all functions work correctly

### **Step 3: Integrate into Existing Pages**

#### **Add Reviews to Gym Cards**

```tsx
import RatingDisplay from '../components/RatingDisplay';

// In your gym card component
<RatingDisplay
  rating={club.average_rating || 0}
  reviewCount={club.total_reviews || 0}
  size="sm"
/>
```

#### **Add Reviews Section to Gym Detail Pages**

```tsx
import ReviewsSection from '../components/ReviewsSection';

// In your gym detail page
<ReviewsSection
  clubId={club.id}
  clubName={club.name}
  onReviewCreated={() => {
    // Refresh gym data or show success message
  }}
/>
```

## 📊 Database Schema

### **Reviews Table**
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  club_id UUID REFERENCES clubs(id),
  booking_id UUID REFERENCES orders(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(100),
  comment TEXT,
  cleanliness INTEGER CHECK (cleanliness >= 1 AND cleanliness <= 5),
  equipment INTEGER CHECK (equipment >= 1 AND equipment <= 5),
  staff_friendliness INTEGER CHECK (staff_friendliness >= 1 AND staff_friendliness <= 5),
  value_for_money INTEGER CHECK (value_for_money >= 1 AND value_for_money <= 5),
  atmosphere INTEGER CHECK (atmosphere >= 1 AND atmosphere <= 5),
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  status review_status DEFAULT 'APPROVED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Review Helpful Table**
```sql
CREATE TABLE review_helpful (
  id UUID PRIMARY KEY,
  review_id UUID REFERENCES reviews(id),
  user_id UUID REFERENCES profiles(id),
  is_helpful BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 API Functions

### **ReviewsAPI Methods**

```typescript
// Get reviews for a club
ReviewsAPI.getClubReviews(clubId, filters)

// Create a new review
ReviewsAPI.createReview(reviewData)

// Update an existing review
ReviewsAPI.updateReview(reviewId, updates)

// Delete a review
ReviewsAPI.deleteReview(reviewId)

// Mark review as helpful
ReviewsAPI.toggleReviewHelpful(reviewId, isHelpful)

// Get club rating summary
ReviewsAPI.getClubRatingSummary(clubId)

// Get user's reviews
ReviewsAPI.getUserReviews(userId, filters)

// Check if user can review club
ReviewsAPI.canUserReviewClub(clubId)

// Get featured reviews
ReviewsAPI.getFeaturedReviews(clubId, limit)
```

## 🎨 UI Components

### **ReviewsSection**
- Complete reviews display and creation interface
- Rating summary with distribution charts
- Review form with detailed ratings
- Review cards with helpful voting

### **RatingDisplay**
- Simple star rating display
- Configurable size (sm, md, lg)
- Shows rating and review count

### **ReviewCard**
- Individual review display
- Star ratings and detailed breakdowns
- Helpful voting functionality
- User information and verification status

## 🔒 Security Features

### **Row Level Security Policies**

1. **Reviews Table:**
   - Users can view all reviews
   - Users can create reviews for their paid bookings only
   - Users can update/delete their own reviews

2. **Review Helpful Table:**
   - Users can view all helpful votes
   - Users can vote on reviews (one vote per user per review)

### **Business Rules**

1. **Review Eligibility:**
   - Must have a paid booking for the club
   - Can only review once per booking
   - Must be authenticated user

2. **Rating Validation:**
   - Overall rating: 1-5 stars (required)
   - Detailed ratings: 1-5 stars (optional)
   - Title: max 100 characters
   - Comment: unlimited text

## 🚀 Next Steps

### **Integration Checklist**

- [ ] Run database migration
- [ ] Test reviews system
- [ ] Add RatingDisplay to gym cards
- [ ] Add ReviewsSection to gym detail pages
- [ ] Update gym listing to show ratings
- [ ] Add reviews to user profile
- [ ] Implement review moderation (admin)

### **Advanced Features (Future)**

- [ ] Review moderation system
- [ ] Photo attachments in reviews
- [ ] Review response from gym owners
- [ ] Review analytics dashboard
- [ ] Review notifications
- [ ] Review export functionality

## 🐛 Troubleshooting

### **Common Issues**

1. **"Cannot review this club" Error**
   - Ensure user has a paid booking
   - Check if user already reviewed this club
   - Verify user authentication

2. **Rating Not Updating**
   - Check if trigger function exists
   - Verify RLS policies are correct
   - Ensure proper permissions

3. **Reviews Not Displaying**
   - Check RLS policies
   - Verify user authentication
   - Check database connection

### **Debug Commands**

```sql
-- Check if reviews table exists
SELECT * FROM information_schema.tables WHERE table_name = 'reviews';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'reviews';

-- Test rating update function
SELECT update_club_ratings('your-club-id');

-- Check review eligibility
SELECT can_user_review_club('user-id', 'club-id');
```

## 📞 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify database migration completed successfully
3. Test API functions individually
4. Check RLS policies and permissions

The reviews system is now ready to enhance your Drop-In Morocco app with user feedback and ratings! 🌟
