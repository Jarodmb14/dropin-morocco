# 🧪 Drop-In Morocco Testing Guide

## 🚀 Quick Start Testing

### 1. Start the Application
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

### 2. Seed Sample Data
1. Navigate to `http://localhost:5173/admin`
2. Click **"Seed Sample Data"** button
3. Wait for confirmation message
4. Click **"Load Statistics"** to verify data

## 🎯 Testing Scenarios

### 📱 **Customer Flow Testing**

#### Test Case 1: Browse and Book
1. **Navigate to**: `http://localhost:5173/gym-booking`
2. **Expected**: See login prompt if not authenticated
3. **Login**: Use `customer@example.com` / `password123`
4. **Browse Gyms**: 
   - Should see 5 gyms (Casablanca, Marrakech, Rabat, Tangier, Fez)
   - Each gym shows capacity, current occupancy, rating
5. **Select Gym**: Click "View Packages" on any gym
6. **Choose Package**: Select any product (Single Entry, Day Pass, etc.)
7. **Complete Booking**: Click "Confirm Booking"
8. **Expected**: Success message and QR codes generated

#### Test Case 2: QR Code Management
1. **Navigate to**: "My QR Codes" tab
2. **Expected**: See generated QR codes with:
   - Real QR code image
   - Status (ACTIVE)
   - Expiration date
   - Usage count
3. **Test QR Actions**:
   - **Download**: Click download button
   - **Share**: Click share button (mobile only)
   - **Copy**: Click copy button
   - **Show Data**: Expand "Show QR Code Data"

### 🏢 **Club Owner Flow Testing**

#### Test Case 3: QR Code Scanner
1. **Navigate to**: `http://localhost:5173/qr-scanner`
2. **Login**: Use `owner1@example.com` / `password123`
3. **Select Club**: Choose "Fitness Plus Casablanca"
4. **Test Manual Input**:
   - Copy a QR code from customer flow
   - Paste in manual input field
   - Click "Scan QR Code"
   - **Expected**: Success message with customer details
5. **Test Camera Scanner** (mobile only):
   - Click "Start Camera"
   - Point camera at QR code
   - **Expected**: Automatic scan and validation

#### Test Case 4: Multiple Scans
1. **Scan Same QR**: Try scanning the same QR code twice
2. **Expected**: Second scan should fail (already used)
3. **Check Status**: QR code status should change to "USED"

### 👨‍💼 **Admin Flow Testing**

#### Test Case 5: Admin Dashboard
1. **Navigate to**: `http://localhost:5173/admin`
2. **Login**: Use `admin@dropin.ma` / `password123`
3. **Test Features**:
   - **Seed Data**: Click to populate database
   - **Load Statistics**: View system metrics
   - **Quick Actions**: Test navigation buttons

## 🔧 **Technical Testing**

### Test Case 6: API Integration
1. **Open Browser Console** (F12)
2. **Navigate through pages** and check for errors
3. **Expected**: No console errors, successful API calls
4. **Check Network Tab**: Verify Supabase requests

### Test Case 7: Responsive Design
1. **Test on Different Screen Sizes**:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)
2. **Expected**: All elements properly responsive
3. **Test Mobile Features**:
   - Camera access for QR scanning
   - Touch interactions
   - Share functionality

### Test Case 8: Error Handling
1. **Test Invalid Login**: Use wrong credentials
2. **Expected**: Error message displayed
3. **Test Network Issues**: Disconnect internet
4. **Expected**: Graceful error handling
5. **Test Invalid QR Codes**: Scan random text
6. **Expected**: Validation error message

## 📊 **Data Validation Testing**

### Test Case 9: Database Verification
1. **Check Supabase Dashboard**:
   - Go to your Supabase project
   - Navigate to Table Editor
   - Verify tables are populated:
     - `clubs` (5 records)
     - `products` (8 records)
     - `users` (4 records)
     - `orders` (after bookings)
     - `qr_codes` (after bookings)

### Test Case 10: Real-time Updates
1. **Open Two Browser Windows**:
   - Window 1: Customer booking page
   - Window 2: Club owner scanner page
2. **Make Booking**: Complete booking in Window 1
3. **Scan QR**: Immediately scan in Window 2
4. **Expected**: Real-time synchronization

## 🎨 **UI/UX Testing**

### Test Case 11: Visual Consistency
1. **Check All Pages**:
   - Homepage (`/`)
   - Gym Booking (`/gym-booking`)
   - QR Scanner (`/qr-scanner`)
   - Auth (`/auth`)
   - Admin (`/admin`)
2. **Verify**:
   - Consistent color scheme
   - Proper spacing and alignment
   - Loading states
   - Success/error messages

### Test Case 12: Accessibility
1. **Keyboard Navigation**: Navigate using Tab key
2. **Screen Reader**: Test with screen reader
3. **Color Contrast**: Verify text readability
4. **Focus Indicators**: Check focus visibility

## 🚨 **Edge Case Testing**

### Test Case 13: Capacity Limits
1. **Seed Data**: Ensure clubs have capacity
2. **Make Multiple Bookings**: Book until capacity reached
3. **Expected**: Capacity warnings or booking restrictions

### Test Case 14: Expired QR Codes
1. **Create Booking**: Generate QR codes
2. **Wait for Expiration**: (or manually expire in database)
3. **Try to Scan**: Attempt to use expired QR
4. **Expected**: "Expired" error message

### Test Case 15: Concurrent Users
1. **Open Multiple Tabs**: Same user, different tabs
2. **Make Simultaneous Bookings**: Try booking same product
3. **Expected**: Proper conflict resolution

## 📱 **Mobile Testing**

### Test Case 16: Capacitor Integration
1. **Build for Mobile**:
   ```bash
   npm run mobile:build
   npx cap sync
   ```
2. **Open in Mobile Simulator**:
   ```bash
   npx cap open ios    # For iOS
   npx cap open android # For Android
   ```
3. **Test Mobile Features**:
   - Camera access for QR scanning
   - Touch gestures
   - Mobile-specific UI elements

## 🔍 **Performance Testing**

### Test Case 17: Load Testing
1. **Multiple Bookings**: Make 10+ bookings quickly
2. **Expected**: No performance degradation
3. **Check Memory Usage**: Monitor browser memory
4. **Test QR Generation**: Generate many QR codes

### Test Case 18: Network Performance
1. **Slow Network**: Use browser dev tools to simulate 3G
2. **Expected**: Graceful loading states
3. **Offline Mode**: Test offline functionality

## 🐛 **Bug Reporting**

When you find issues, please report with:
1. **Steps to Reproduce**: Exact steps taken
2. **Expected Behavior**: What should happen
3. **Actual Behavior**: What actually happened
4. **Environment**: Browser, OS, screen size
5. **Console Errors**: Any error messages

## ✅ **Testing Checklist**

- [ ] Application starts without errors
- [ ] Sample data seeds successfully
- [ ] Customer can browse and book gyms
- [ ] QR codes generate correctly
- [ ] QR codes can be downloaded/shared
- [ ] Club owner can scan QR codes
- [ ] Admin dashboard shows statistics
- [ ] Authentication works for all user types
- [ ] Responsive design works on all screen sizes
- [ ] Error handling works properly
- [ ] Real-time updates function correctly
- [ ] Mobile features work (camera, touch)
- [ ] Performance is acceptable under load

## 🎉 **Success Criteria**

The system is working correctly when:
1. **End-to-end flow works**: Customer booking → QR generation → Club scanning
2. **No console errors**: Clean browser console
3. **Data persists**: Bookings saved in database
4. **Real-time sync**: Changes reflect immediately
5. **Mobile responsive**: Works on all devices
6. **Error handling**: Graceful error messages
7. **Performance**: Fast loading and response times

---

**Happy Testing! 🧪** If you encounter any issues, check the console for error messages and refer to the troubleshooting section in the main documentation.
