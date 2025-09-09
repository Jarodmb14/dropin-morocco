import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import NetworkErrorHandler from "./components/NetworkErrorHandler";
import ComicHomepage from "./pages/ComicHomepage";
import ComicVenues from "./pages/ComicVenues";
import ComicVenuesNoMap from "./pages/ComicVenuesNoMap";
import VenuesTest from "./pages/VenuesTest";
import ComicVenuesMinimal from "./pages/ComicVenuesMinimal";
import GymDetail from "./pages/GymDetail";
import AuthTest from "./pages/AuthTest";
import PaymentTest from "./pages/PaymentTest";
import SimpleTest from "./pages/SimpleTest";
import UnifiedLocation from "./pages/UnifiedLocation";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerQRScanner from "./pages/OwnerQRScanner";
import CreateGym from "./pages/CreateGym";
import ManageGym from "./pages/ManageGym";
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
import SimpleAdmin from "./pages/SimpleAdmin";
import AdminTest from "./pages/AdminTest";
import AdminDebug from "./pages/AdminDebug";
import SimpleAdminDebug from "./pages/SimpleAdminDebug";
import ReviewsTest from "./pages/ReviewsTest";
import BodyPartsSelection from "./pages/BodyPartsSelection";
import ExercisesList from "./pages/ExercisesList";
import Training from "./pages/Training";
import BodyPickerPage from "./pages/BodyPickerPage";
import TestPage from "./pages/TestPage";
import UltraSimple from "./pages/UltraSimple";
import LocationTest from "./pages/LocationTest";
import UsersTest from "./pages/UsersTest";
import BookingsTest from "./pages/BookingsTest";
import SimpleClubsTest from "./pages/SimpleClubsTest";
import SupabaseTest from "./pages/SupabaseTest";
import NetworkTest from "./pages/NetworkTest";
import ClubsDebug from "./pages/ClubsDebug";
import { GymMapPage } from "./pages/GymMapPage";
import { SimpleAirbnbMap } from "./pages/SimpleAirbnbMap";
import { TestMap } from "./pages/TestMap";
import { MinimalMap } from "./pages/MinimalMap";
import SimpleTestPage from "./pages/SimpleTestPage";
import { MapTestPage } from "./pages/MapTestPage";
import { SimpleGymMapPage } from "./pages/SimpleGymMapPage";
import { BasicMapPage } from "./pages/BasicMapPage";
import MinimalTest from "./pages/MinimalTest";
import SimpleMapTest from "./pages/SimpleMapTest";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ErrorBoundary>
        <NetworkErrorHandler>
          <Routes>
          {/* Customer app entry */}
          <Route path="/" element={<ComicHomepage />} />
          <Route path="/venues" element={<ComicVenues />} />
          <Route path="/body-parts" element={<BodyPartsSelection />} />
          <Route path="/exercises/:bodyPart" element={<ExercisesList />} />
          <Route path="/body-picker" element={<BodyPickerPage />} />
          <Route path="/gym/:id" element={<GymDetail />} />
          <Route path="/auth-test" element={<AuthTest />} />
          <Route path="/payment-test" element={<PaymentTest />} />
          <Route path="/simple-test" element={<SimpleTest />} />
          <Route path="/venues-test" element={<VenuesTest />} />
          <Route path="/venues-minimal" element={<ComicVenuesMinimal />} />
          <Route path="/venues-no-map" element={<ComicVenuesNoMap />} />
          <Route path="/gyms" element={<ComicVenues />} />
                  <Route path="/map" element={<GymMapPage />} />
                  <Route path="/simple-map" element={<SimpleAirbnbMap />} />
                  <Route path="/minimal-map" element={<MinimalMap />} />
                  <Route path="/test-map" element={<TestMap />} />
                  <Route path="/simple-test" element={<SimpleTestPage />} />
                  <Route path="/map-test" element={<MapTestPage />} />
                  <Route path="/simple-gym-map" element={<SimpleGymMapPage />} />
                  <Route path="/basic-map" element={<BasicMapPage />} />
                  <Route path="/minimal-test" element={<MinimalTest />} />
                  <Route path="/simple-map-test" element={<SimpleMapTest />} />
             <Route path="/test" element={<SimpleTest />} />
             <Route path="/location-test" element={<LocationTest />} />
             <Route path="/reviews-test" element={<ReviewsTest />} />
             <Route path="/users-test" element={<UsersTest />} />
            <Route path="/bookings-test" element={<BookingsTest />} />
            <Route path="/simple-clubs-test" element={<SimpleClubsTest />} />
            <Route path="/supabase-test" element={<SupabaseTest />} />
            <Route path="/network-test" element={<NetworkTest />} />
            <Route path="/clubs-debug" element={<ClubsDebug />} />

          {/* Owner (club) routes - Protected */}
          <Route path="/owner" element={
            <ProtectedRoute requiredRole="CLUB_OWNER">
              <OwnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/owner/dashboard" element={
            <ProtectedRoute requiredRole="CLUB_OWNER">
              <OwnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/owner/scan" element={
            <ProtectedRoute requiredRole="CLUB_OWNER">
              <OwnerQRScanner />
            </ProtectedRoute>
          } />
          <Route path="/owner/create-gym" element={
            <ProtectedRoute requiredRole="CLUB_OWNER">
              <CreateGym />
            </ProtectedRoute>
          } />
          <Route path="/owner/manage-gym/:id" element={
            <ProtectedRoute requiredRole="CLUB_OWNER">
              <ManageGym />
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

          {/* Training - Protected for logged-in users only */}
          <Route path="/training" element={
            <ProtectedRoute>
              <Training />
            </ProtectedRoute>
          } />

          {/* Misc */}
          <Route path="/gym-booking" element={<GymBooking />} />
          <Route path="/qr-scanner" element={<QRScanner />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/simple-admin" element={<SimpleAdmin />} />
          <Route path="/admin-test" element={<AdminTest />} />
          <Route path="/admin-debug" element={<AdminDebug />} />
          <Route path="/simple-admin-debug" element={<SimpleAdminDebug />} />
          <Route path="/reviews-test" element={<ReviewsTest />} />
          <Route path="/auth-test" element={<AuthTest />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </NetworkErrorHandler>
      </ErrorBoundary>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
