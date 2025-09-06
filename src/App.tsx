import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import NetworkErrorHandler from "./components/NetworkErrorHandler";
import SimpleTest from "./pages/SimpleTest";
import ComicHomepage from "./pages/ComicHomepage";
import ComicVenues from "./pages/ComicVenues";
import UnifiedLocation from "./pages/UnifiedLocation";
import OwnerDashboard from "./pages/OwnerDashboard";
import NotFound from "./pages/NotFound";
import GymBooking from "./pages/GymBooking";
import QRScanner from "./pages/QRScanner";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";
import UserProfile from "./pages/UserProfile";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AuthTest from "./pages/AuthTest";
import LocationTest from "./pages/LocationTest";
import ReviewsTest from "./pages/ReviewsTest";
import UsersTest from "./pages/UsersTest";
import BookingsTest from "./pages/BookingsTest";

const App = () => (
  <ErrorBoundary>
    <NetworkErrorHandler>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          {/* Customer app entry */}
          <Route path="/" element={<ComicHomepage />} />
          <Route path="/venues" element={<UnifiedLocation />} />
          <Route path="/gyms" element={<ComicVenues />} />
             <Route path="/test" element={<SimpleTest />} />
             <Route path="/location-test" element={<LocationTest />} />
             <Route path="/reviews-test" element={<ReviewsTest />} />
             <Route path="/users-test" element={<UsersTest />} />
            <Route path="/bookings-test" element={<BookingsTest />} />

          {/* Owner (club) routes - Protected */}
          <Route path="/owner" element={
            <ProtectedRoute requiredRole="CLUB_OWNER">
              <OwnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/owner/scan" element={
            <ProtectedRoute requiredRole="CLUB_OWNER">
              <QRScanner />
            </ProtectedRoute>
          } />

          {/* Authentication */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/auth/verify" element={<EmailVerification />} />
          <Route path="/auth" element={<Auth />} />

          {/* User Profile */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />

          {/* Misc */}
          <Route path="/gym-booking" element={<GymBooking />} />
          <Route path="/qr-scanner" element={<QRScanner />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth-test" element={<AuthTest />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </NetworkErrorHandler>
  </ErrorBoundary>
);

export default App;
