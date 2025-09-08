# Reviews System Setup Guide

## 🎯 Quick Setup (5 minutes)

### Step 1: Set Up Database
1. **Go to Supabase Dashboard** → Your Project → SQL Editor
2. **Copy and paste** the content from `src/lib/api/setup-reviews-database.sql`
3. **Click "Run"** to execute the SQL script
4. **Verify success** - you should see "Reviews table created successfully"

### Step 2: Test the Reviews System
1. **Deploy your app** (if not already deployed)
2. **Visit** `/reviews-test` to test the reviews functionality
3. **Try creating a review** using the test page

### Step 3: Check Integration
1. **Go to any gym detail page** (`/gym/[id]`)
2. **Scroll down** to see the "Reviews & Ratings" section
3. **Verify** that reviews are displayed correctly

## 🔧 What the Setup Does

### Database Tables Created:
- **`reviews`** - Stores user reviews and ratings
- **`review_helpful`** - Tracks helpful/unhelpful votes
- **Rating columns** added to `clubs` table

### Functions Created:
- **`can_user_review_club()`** - Checks if user can review (has paid booking)
- **`get_club_reviews()`** - Retrieves reviews with user info
- **`update_club_rating()`** - Automatically updates club ratings

### Security Features:
- **Row Level Security (RLS)** enabled
- **User permissions** properly configured
- **Data validation** with constraints

## 🎨 Features Available After Setup

### For Users:
- ✅ **Write Reviews** - Rate gyms 1-5 stars
- ✅ **Detailed Ratings** - Rate cleanliness, equipment, staff, etc.
- ✅ **Helpful Voting** - Mark reviews as helpful/unhelpful
- ✅ **Review Filtering** - Filter by rating
- ✅ **Review History** - See all your reviews

### For Gym Owners:
- ✅ **Average Rating Display** - Shows overall rating
- ✅ **Review Analytics** - See rating breakdown
- ✅ **Review Moderation** - Approve/reject reviews (admin)

### For Admins:
- ✅ **Review Management** - Moderate all reviews
- ✅ **Analytics Dashboard** - Review statistics
- ✅ **Quality Control** - Flag inappropriate reviews

## 🚨 Troubleshooting

### If Reviews Don't Show:
1. **Check database setup** - Make sure SQL script ran successfully
2. **Check console errors** - Look for any JavaScript errors
3. **Verify user authentication** - User must be logged in
4. **Check network connection** - Ensure Supabase connection works

### If Can't Write Reviews:
1. **Check user permissions** - User must have paid booking
2. **Verify club ID** - Make sure club exists in database
3. **Check RLS policies** - Ensure policies are correctly set

### If Ratings Don't Update:
1. **Check triggers** - Verify triggers are created
2. **Check function permissions** - Ensure functions are accessible
3. **Verify club ID** - Make sure club exists

## 📱 Mobile Testing

### Test on Mobile:
1. **Open app on mobile** browser
2. **Navigate to gym detail** page
3. **Scroll to reviews** section
4. **Try writing a review** (if eligible)
5. **Test star rating** interface
6. **Verify responsive design**

## 🎯 Next Steps

### After Setup:
1. **Test with real users** - Have friends try the reviews
2. **Add sample reviews** - Create some test reviews
3. **Monitor performance** - Check for any issues
4. **Gather feedback** - Ask users about the experience

### Future Enhancements:
- **Review photos** - Allow users to upload photos
- **Review replies** - Let gym owners respond to reviews
- **Review notifications** - Notify users of new reviews
- **Review analytics** - More detailed statistics

## 📞 Support

If you encounter any issues:
1. **Check the console** for error messages
2. **Verify database setup** is complete
3. **Test with the reviews test page** first
4. **Check Supabase logs** for any errors

---

**Your reviews system is now ready to help users make informed decisions about gyms!** ⭐