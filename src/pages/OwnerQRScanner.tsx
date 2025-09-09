import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock,
  MapPin,
  User,
  Calendar
} from 'lucide-react';
import { QRScanner } from '@/components/QRScanner';
import { QRCodeGenerator } from '@/lib/qr-code';
import { Link } from 'react-router-dom';

interface Gym {
  id: string;
  name: string;
  address: string;
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'LUXURY';
}

interface Booking {
  id: string;
  user_id: string;
  club_id: string;
  booking_type: string;
  scheduled_start: string;
  scheduled_end: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  created_at: string;
  user_name?: string;
  user_email?: string;
}

const OwnerQRScanner = () => {
  const { user, userRole } = useAuth();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [lastScannedBooking, setLastScannedBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userRole === 'CLUB_OWNER') {
      loadOwnerData();
    }
  }, [userRole]);

  const loadOwnerData = async () => {
    try {
      setIsLoading(true);
      
      // Load owner's gyms
      console.log('🔍 Loading gyms for owner ID:', user?.id);
      const gymsResponse = await fetch(`https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/clubs?owner_id=eq.${user?.id}&select=*`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE'
        }
      });
      
      if (gymsResponse.ok) {
        const gymsData = await gymsResponse.json();
        console.log('🏋️ Loaded owner gyms:', gymsData);
        setGyms(gymsData);
        
        // Load bookings for all owner's gyms
        if (gymsData.length > 0) {
          const gymIds = gymsData.map((gym: any) => gym.id).join(',');
          console.log('🆔 Gym IDs for booking query:', gymIds);
          await loadBookings(gymIds);
        } else {
          console.warn('⚠️ No gyms found for owner:', user?.id);
        }
      } else {
        console.error('❌ Failed to load gyms:', gymsResponse.status, gymsResponse.statusText);
      }
      
    } catch (error) {
      console.error('Error loading owner data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBookings = async (gymIds: string) => {
    try {
      const bookingsResponse = await fetch(`https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/bookings?club_id=in.(${gymIds})&select=*`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE'
        }
      });
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const handleQRCodeScanned = async (qrData: string) => {
    try {
      console.log('🔍 QR Code scanned:', qrData);
      
      // Parse QR code data
      const bookingData = QRCodeGenerator.parseQRCodeData(qrData);
      
      if (!bookingData) {
        alert('❌ Invalid QR code format');
        return;
      }
      
      // Check if this booking belongs to one of the owner's gyms
      console.log('🔍 Debugging QR validation:');
      console.log('📱 QR bookingData:', bookingData);
      console.log('🏋️ Owner gyms:', gyms);
      
      // Handle both clubId (camelCase) and club_id (snake_case) formats
      const clubId = bookingData.clubId || bookingData.club_id;
      console.log('🆔 Booking club ID (both formats):', { clubId: bookingData.clubId, club_id: bookingData.club_id, resolved: clubId });
      console.log('🆔 Gym IDs:', gyms.map(gym => gym.id));
      
      const isOwnerBooking = gyms.some(gym => gym.id === clubId);
      console.log('✅ Is owner booking:', isOwnerBooking);
      
      if (!isOwnerBooking) {
        console.error('❌ QR validation failed - not owner booking');
        alert(`❌ This QR code is not for your gym.\n\nDebug info:\nQR Club ID: ${clubId}\nYour Gym IDs: ${gyms.map(gym => gym.id).join(', ')}`);
        return;
      }
      
      // Find the booking in the database
      const bookingId = bookingData.bookingId || bookingData.booking_id;
      const booking = bookings.find(b => b.id === bookingId);
      
      if (!booking) {
        alert('❌ Booking not found');
        return;
      }
      
      setLastScannedBooking(booking);
      
      // Validate booking
      const now = new Date();
      const bookingStart = new Date(booking.scheduled_start);
      const bookingEnd = new Date(booking.scheduled_end);
      
      if (now < bookingStart) {
        alert('⏰ Booking is not yet valid. Check-in time: ' + bookingStart.toLocaleString());
        return;
      }
      
      if (now > bookingEnd) {
        alert('❌ Booking has expired. Valid until: ' + bookingEnd.toLocaleString());
        return;
      }
      
      if (booking.status !== 'CONFIRMED') {
        alert('❌ Booking is not confirmed. Status: ' + booking.status);
        return;
      }
      
      // Update booking status to completed
      await updateBookingStatus(booking.id, 'COMPLETED');
      
      alert('✅ Booking validated successfully! Welcome to ' + gyms.find(g => g.id === booking.club_id)?.name);
      
    } catch (error) {
      console.error('Error validating QR code:', error);
      alert('❌ Error validating QR code: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/bookings?id=eq.${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE'
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        // Reload bookings to update the UI
        const gymIds = gyms.map(gym => gym.id).join(',');
        await loadBookings(gymIds);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PENDING': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'CANCELLED': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'COMPLETED': return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTierEmoji = (tier: string) => {
    switch (tier) {
      case 'BASIC': return '🏋️';
      case 'STANDARD': return '🏋️';
      case 'PREMIUM': return '🏋️';
      case 'LUXURY': return '🏋️';
      default: return '🏋️';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-space-grotesk">Loading scanner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-space-grotesk font-bold text-gray-900">
                📱 QR Code Scanner
              </h1>
              <p className="text-gray-600 font-space-grotesk">
                Scan customer QR codes to validate bookings
              </p>
            </div>
            <Link
              to="/owner/dashboard"
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-space-grotesk font-medium transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* QR Scanner */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-space-grotesk font-semibold text-gray-900">
                  📱 Scan QR Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <p className="text-gray-600 font-space-grotesk mb-4">
                    Point your camera at the customer's QR code to validate their booking
                  </p>
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-500 font-space-grotesk">
                      Make sure the QR code is clearly visible and well-lit
                    </p>
                  </div>
                </div>
                
                <QRScanner
                  onQRCodeScanned={handleQRCodeScanned}
                  onClose={() => {}}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* My Gyms */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-space-grotesk font-semibold text-gray-900">
                  My Gyms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gyms.map((gym) => (
                    <div key={gym.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-space-grotesk font-medium text-gray-900">
                          {gym.name}
                        </div>
                        <div className="text-sm text-gray-600 font-space-grotesk">
                          {gym.address}
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 font-space-grotesk font-medium">
                        {getTierEmoji(gym.tier)} {gym.tier}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Debug Info */}
            <Card className="bg-yellow-50 border border-yellow-200">
              <CardHeader>
                <CardTitle className="text-lg font-space-grotesk font-semibold text-yellow-800">
                  🐛 Debug Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-yellow-800">Owner ID:</span>
                    <span className="text-yellow-700 ml-2">{user?.id}</span>
                  </div>
                  <div>
                    <span className="font-medium text-yellow-800">Gyms Count:</span>
                    <span className="text-yellow-700 ml-2">{gyms.length}</span>
                  </div>
                  <div>
                    <span className="font-medium text-yellow-800">Gym IDs:</span>
                    <div className="text-yellow-700 ml-2 text-xs">
                      {gyms.map(gym => gym.id).join(', ')}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-yellow-800">Bookings Count:</span>
                    <span className="text-yellow-700 ml-2">{bookings.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Last Scanned Booking */}
            {lastScannedBooking && (
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-space-grotesk font-semibold text-gray-900">
                    Last Scanned Booking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-600 mr-2" />
                      <span className="text-sm font-space-grotesk text-gray-900">
                        {lastScannedBooking.user_name || lastScannedBooking.user_email || 'Unknown User'}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-600 mr-2" />
                      <span className="text-sm font-space-grotesk text-gray-900">
                        {gyms.find(g => g.id === lastScannedBooking.club_id)?.name || 'Unknown Gym'}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-600 mr-2" />
                      <span className="text-sm font-space-grotesk text-gray-900">
                        {new Date(lastScannedBooking.scheduled_start).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-600 mr-2" />
                      <span className="text-sm font-space-grotesk text-gray-900">
                        {new Date(lastScannedBooking.scheduled_start).toLocaleTimeString()} - {new Date(lastScannedBooking.scheduled_end).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      {getStatusIcon(lastScannedBooking.status)}
                      <span className="ml-2 text-sm font-space-grotesk text-gray-900">
                        {lastScannedBooking.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card className="bg-blue-50 border border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg font-space-grotesk font-semibold text-blue-900">
                  📋 Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-blue-800 font-space-grotesk">
                  <p>1. Ask customer to show their QR code</p>
                  <p>2. Point camera at the QR code</p>
                  <p>3. Wait for validation result</p>
                  <p>4. Allow entry if valid</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerQRScanner;
