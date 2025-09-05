# Drop-In Morocco Backend Integration Guide

## 🚀 Overview

This guide covers the complete backend integration for the Drop-In Morocco fitness platform, including real gym data, booking functionality, and QR code generation.

## 📋 Features Implemented

### ✅ Core Features
- **Authentication System** - User registration and login with role-based access
- **Real Gym Data** - 5 sample gyms across Morocco with detailed information
- **Booking System** - Complete booking flow with product selection
- **QR Code Generation** - Real QR codes with download, share, and copy functionality
- **QR Code Scanner** - Camera-based and manual QR code scanning for club owners
- **Payment Processing** - Mock payment system integrated with Stripe
- **Admin Dashboard** - System management and data seeding
- **Real-time Updates** - Live data synchronization

### 🏋️ Sample Gyms Included
1. **Fitness Plus Casablanca** - Premium fitness center
2. **Marrakech Wellness Center** - Luxury spa and fitness
3. **Rabat Sports Club** - Modern sports facility with pool
4. **Tangier Fitness Hub** - Community fitness center
5. **Fez Yoga & Pilates Studio** - Specialized studio

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install qrcode @types/qrcode
```

### 2. Database Setup
The system uses Supabase as the backend. Ensure your database tables are set up according to the schema in `src/lib/api/`.

### 3. Seed Sample Data
1. Navigate to `/admin` in your application
2. Click "Seed Sample Data" to populate the database with:
   - 5 gyms across Morocco
   - 8 different product types
   - 4 test users (customer, club owners, admin)

### 4. Test Credentials
```
Customer: customer@example.com / password123
Club Owner: owner1@example.com / password123
Admin: admin@dropin.ma / password123
```

## 🎯 User Flows

### Customer Flow
1. **Browse Gyms** - View available fitness venues
2. **Select Package** - Choose from various access options
3. **Complete Booking** - Purchase and receive QR codes
4. **Access Venue** - Present QR code for entry

### Club Owner Flow
1. **Access Scanner** - Navigate to QR scanner page
2. **Select Club** - Choose your venue
3. **Scan QR Codes** - Validate customer entry
4. **View Results** - See customer details and entry status

### Admin Flow
1. **Dashboard Access** - View system statistics
2. **Data Management** - Seed sample data
3. **System Monitoring** - Track usage and revenue

## 📱 Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Index | Main homepage |
| `/gym-booking` | GymBooking | Browse and book gyms |
| `/qr-scanner` | QRScanner | QR code scanner for club owners |
| `/auth` | Auth | User authentication |
| `/admin` | Admin | Admin dashboard |

## 🔧 API Integration

### Main API Class
```typescript
import { DropInAPI } from "@/lib/api";

// Customer purchase flow
const result = await DropInAPI.customerPurchaseFlow(productId);

// Club owner scan flow
const scanResult = await DropInAPI.clubOwnerScanFlow(qrCode, clubId);

// Get admin dashboard
const dashboard = await DropInAPI.getAdminDashboard();
```

### Key API Methods
- `DropInAPI.auth.login()` - User authentication
- `DropInAPI.clubs.getClubs()` - Fetch gym data
- `DropInAPI.products.getProducts()` - Get available packages
- `DropInAPI.orders.createOrder()` - Create bookings
- `DropInAPI.qrCodes.generateQRCode()` - Generate QR codes
- `DropInAPI.qrCodes.scanQRCode()` - Validate QR codes

## 🎨 QR Code Features

### Generation
- Real QR codes using the `qrcode` library
- Custom styling with Drop-In Morocco branding
- Multiple export options (download, share, copy)

### Scanner
- Camera-based scanning for mobile devices
- Manual QR code input for desktop
- Real-time validation and feedback
- Customer details display

## 💳 Payment Integration

The system includes a mock payment system that can be easily replaced with real payment providers:

```typescript
// Mock payment processing
const paymentResult = await DropInAPI.payments.processCardPayment(
  orderId,
  paymentMethodId
);
```

## 🔐 Security Features

- Role-based access control (CUSTOMER, CLUB_OWNER, ADMIN)
- QR code validation with expiration dates
- Usage tracking and limits
- Secure authentication with Supabase

## 📊 Data Structure

### Clubs
```typescript
interface Club {
  id: string;
  name: string;
  description: string;
  address: string;
  location: string;
  capacity: number;
  current_occupancy: number;
  rating: number;
  status: 'ACTIVE' | 'INACTIVE';
  owner_id: string;
}
```

### Products
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  validity_days: number;
  club_id: string;
  status: 'ACTIVE' | 'INACTIVE';
}
```

### QR Codes
```typescript
interface QRCode {
  id: string;
  code: string;
  product_name: string;
  club_name: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
  expires_at: string;
  uses_count: number;
  max_uses: number;
}
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Mobile Build
```bash
npm run mobile:build
npx cap sync
```

## 🔍 Testing

1. **Seed Data** - Use admin panel to populate database
2. **Test Authentication** - Try different user roles
3. **Test Booking Flow** - Complete a full booking cycle
4. **Test QR Scanning** - Use scanner with generated QR codes
5. **Test Mobile** - Verify responsive design and mobile features

## 📈 Analytics

The admin dashboard provides:
- Total users, clubs, and orders
- Revenue tracking
- Usage statistics
- System health monitoring

## 🔄 Real-time Features

- Live capacity updates
- Real-time QR code validation
- Instant booking confirmations
- Live scanner feedback

## 🎯 Next Steps

1. **Real Payment Integration** - Replace mock payments with Stripe/PayPal
2. **Push Notifications** - Add mobile notifications
3. **Advanced Analytics** - Enhanced reporting and insights
4. **Multi-language Support** - Arabic and French localization
5. **Social Features** - User reviews and ratings

## 🆘 Support

For technical issues or questions:
1. Check the console for error messages
2. Verify database connection
3. Ensure all dependencies are installed
4. Check Supabase configuration

---

**Drop-In Morocco** - Your gateway to fitness freedom across Morocco! 🇲🇦
