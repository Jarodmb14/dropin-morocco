import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BookingsAPI, CreateBookingData, BookingWithDetails } from '@/lib/api/bookings';
import { DropInAPI } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';

const BookingsTest: React.FC = () => {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [qrValidation, setQrValidation] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Form state for creating booking
  const [bookingForm, setBookingForm] = useState<CreateBookingData>({
    club_id: '',
    booking_type: 'SINGLE_SESSION',
    scheduled_start: '',
    scheduled_end: '',
    credits_required: 1,
    price_per_credit: 10.00,
    notes: '',
    special_requests: '',
    equipment_reserved: []
  });

  useEffect(() => {
    loadClubs();
    loadBookings();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadClubs = async () => {
    try {
      console.log('Attempting to load clubs...');
      const clubsData = await DropInAPI.clubs.getClubs();
      console.log('Loaded clubs:', clubsData);
      setClubs(clubsData);
      
      // Also try direct Supabase query as fallback
      if (!clubsData || clubsData.length === 0) {
        console.log('No clubs from API, trying direct Supabase query...');
        const { data, error } = await supabase
          .from('clubs')
          .select('*')
          .eq('is_active', true);
        
        if (error) {
          console.error('Direct Supabase query error:', error);
        } else {
          console.log('Direct Supabase clubs:', data);
          setClubs(data || []);
        }
      }
    } catch (error) {
      console.error('Error loading clubs:', error);
      // Set some mock clubs for testing if the API fails
      setClubs([
        { id: 'mock-club-1', name: 'Atlas Power Gym', tier: 'STANDARD' },
        { id: 'mock-club-2', name: 'Casablanca Pro Fitness', tier: 'PREMIUM' },
        { id: 'mock-club-3', name: 'Rabat Champion Club', tier: 'LUXURY' }
      ]);
    }
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      // For testing, we'll get bookings for a valid UUID or skip if no user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const bookingsData = await BookingsAPI.getUserBookings(user.id, 20);
        setBookings(bookingsData);
      } else {
        console.log('No authenticated user, skipping bookings load');
        setBookings([]);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async () => {
    if (!bookingForm.club_id || !bookingForm.scheduled_start || !bookingForm.scheduled_end) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please log in to create bookings');
      return;
    }

    setLoading(true);
    try {
      const newBooking = await BookingsAPI.createBooking({
        ...bookingForm,
        user_id: user.id // Use authenticated user's ID
      });
      if (newBooking) {
        alert('Booking created successfully!');
        setBookingForm({
          club_id: '',
          booking_type: 'SINGLE_SESSION',
          scheduled_start: '',
          scheduled_end: '',
          credits_required: 1,
          price_per_credit: 10.00,
          notes: '',
          special_requests: '',
          equipment_reserved: []
        });
        loadBookings();
      } else {
        alert('Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (bookingId: string) => {
    try {
      const qrCodeData = await BookingsAPI.generateQRCode(bookingId);
      if (qrCodeData) {
        setQrCode(qrCodeData);
        alert('QR Code generated successfully!');
      } else {
        alert('Failed to generate QR code');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Error generating QR code');
    }
  };

  const validateQRCode = async () => {
    if (!qrCode) {
      alert('Please enter a QR code to validate');
      return;
    }

    try {
      const validation = await BookingsAPI.validateQRCode(qrCode);
      setQrValidation(validation);
      if (validation?.is_valid) {
        alert('QR Code is valid!');
      } else {
        alert('QR Code is invalid or expired');
      }
    } catch (error) {
      console.error('Error validating QR code:', error);
      alert('Error validating QR code');
    }
  };

  const processBooking = async (bookingId: string) => {
    try {
      const success = await BookingsAPI.processBooking(bookingId);
      if (success) {
        alert('Booking processed successfully!');
        loadBookings();
      } else {
        alert('Failed to process booking');
      }
    } catch (error) {
      console.error('Error processing booking:', error);
      alert('Error processing booking');
    }
  };

  const startSession = async (bookingId: string) => {
    try {
      const success = await BookingsAPI.startGymSession(bookingId);
      if (success) {
        alert('Gym session started!');
        loadBookings();
      } else {
        alert('Failed to start gym session');
      }
    } catch (error) {
      console.error('Error starting gym session:', error);
      alert('Error starting gym session');
    }
  };

  const endSession = async (bookingId: string) => {
    try {
      const success = await BookingsAPI.endGymSession(bookingId);
      if (success) {
        alert('Gym session ended!');
        loadBookings();
      } else {
        alert('Failed to end gym session');
      }
    } catch (error) {
      console.error('Error ending gym session:', error);
      alert('Error ending gym session');
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const success = await BookingsAPI.cancelBooking(bookingId, 'test-user-id', 'User cancelled');
      if (success) {
        alert('Booking cancelled successfully!');
        loadBookings();
      } else {
        alert('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Error cancelling booking');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'NO_SHOW': return 'bg-orange-100 text-orange-800';
      case 'EXPIRED': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bookings System Test</h1>
          <div className="flex gap-2">
            <Button onClick={loadClubs} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh Clubs'}
            </Button>
            <Button onClick={loadBookings} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh Bookings'}
            </Button>
            <Button variant="outline" onClick={async () => {
              try {
                // Add a sample club directly via API
                const sampleClub = {
                  name: 'Test Gym ' + Date.now(),
                  description: 'A test gym for booking testing with modern equipment',
                  tier: 'STANDARD',
                  city: 'Casablanca',
                  address: 'Test Address, Casablanca',
                  latitude: 33.5731,
                  longitude: -7.5898,
                  amenities: ['cardio', 'weights'],
                  contact_phone: '+212522123456',
                  contact_email: 'test@gym.com',
                  is_active: true,
                  owner_id: '00000000-0000-0000-0000-000000000001'
                };
                
                const { data, error } = await supabase
                  .from('clubs')
                  .insert([sampleClub])
                  .select();
                
                if (error) {
                  alert('Error adding club: ' + error.message);
                } else {
                  alert('Test club added successfully!');
                  loadClubs(); // Reload clubs
                }
              } catch (err) {
                alert('Error: ' + (err as Error).message);
              }
            }}>
              Add Test Club
            </Button>
          </div>
      </div>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Clubs loaded:</strong> {clubs.length}</p>
          <p><strong>Bookings loaded:</strong> {bookings.length}</p>
          <p><strong>Authentication:</strong> 
            <span className="ml-2">
              {user ? `✅ Logged in as ${user.email}` : '❌ Not logged in'}
            </span>
          </p>
          
          {/* Debug: Show raw clubs data */}
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <p><strong>Debug - Raw clubs data:</strong></p>
            <pre className="text-xs overflow-auto max-h-32">
              {JSON.stringify(clubs, null, 2)}
            </pre>
          </div>
          
          {clubs.length > 0 && (
            <div className="mt-4">
              <p><strong>Available clubs:</strong></p>
              <ul className="list-disc list-inside">
                {clubs.map((club) => (
                  <li key={club.id}>{club.name} ({club.tier}) - {club.city}</li>
                ))}
              </ul>
            </div>
          )}
          
          {clubs.length === 0 && (
            <div className="mt-4 p-3 bg-yellow-100 rounded">
              <p><strong>⚠️ No clubs found!</strong></p>
              <p>This could mean:</p>
              <ul className="list-disc list-inside text-sm">
                <li>No clubs in database</li>
                <li>API error</li>
                <li>RLS policy blocking access</li>
                <li>Clubs marked as inactive</li>
              </ul>
              <p className="text-sm mt-2">Check browser console for detailed error messages.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Login for Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Test Login</CardTitle>
          <CardDescription>Use this to quickly log in for testing bookings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="test-email">Test Email</Label>
              <Input 
                id="test-email" 
                type="email" 
                placeholder="test@example.com" 
                defaultValue="test@example.com"
              />
            </div>
            <div>
              <Label htmlFor="test-password">Test Password</Label>
              <Input 
                id="test-password" 
                type="password" 
                placeholder="password123" 
                defaultValue="password123"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={async () => {
              const email = (document.getElementById('test-email') as HTMLInputElement)?.value;
              const password = (document.getElementById('test-password') as HTMLInputElement)?.value;
              if (email && password) {
                try {
                  const { error } = await supabase.auth.signInWithPassword({ email, password });
                  if (error) {
                    alert('Login failed: ' + error.message);
                  } else {
                    alert('Login successful!');
                    checkAuth(); // Update user state
                    loadBookings(); // Reload bookings after login
                  }
                } catch (err) {
                  alert('Login error: ' + (err as Error).message);
                }
              }
            }}>
              Quick Login
            </Button>
            <Button variant="outline" onClick={async () => {
              try {
                const { error } = await supabase.auth.signOut();
                if (error) {
                  alert('Logout failed: ' + error.message);
                } else {
                  alert('Logged out successfully!');
                  setUser(null); // Clear user state
                  setBookings([]); // Clear bookings after logout
                }
              } catch (err) {
                alert('Logout error: ' + (err as Error).message);
              }
            }}>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Booking</CardTitle>
          <CardDescription>Test the booking creation functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="club">Club</Label>
              <Select value={bookingForm.club_id} onValueChange={(value) => setBookingForm({...bookingForm, club_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a club" />
                </SelectTrigger>
                <SelectContent>
                  {clubs.map((club) => (
                    <SelectItem key={club.id} value={club.id}>
                      {club.name} ({club.tier})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="booking_type">Booking Type</Label>
              <Select value={bookingForm.booking_type} onValueChange={(value: any) => setBookingForm({...bookingForm, booking_type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE_SESSION">Single Session</SelectItem>
                  <SelectItem value="DAILY_PASS">Daily Pass</SelectItem>
                  <SelectItem value="WEEKLY_PASS">Weekly Pass</SelectItem>
                  <SelectItem value="MONTHLY_PASS">Monthly Pass</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scheduled_start">Start Time</Label>
              <Input
                type="datetime-local"
                value={bookingForm.scheduled_start}
                onChange={(e) => setBookingForm({...bookingForm, scheduled_start: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="scheduled_end">End Time</Label>
              <Input
                type="datetime-local"
                value={bookingForm.scheduled_end}
                onChange={(e) => setBookingForm({...bookingForm, scheduled_end: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="credits_required">Credits Required</Label>
              <Input
                type="number"
                value={bookingForm.credits_required}
                onChange={(e) => setBookingForm({...bookingForm, credits_required: parseInt(e.target.value)})}
              />
            </div>

            <div>
              <Label htmlFor="price_per_credit">Price per Credit (MAD)</Label>
              <Input
                type="number"
                step="0.01"
                value={bookingForm.price_per_credit}
                onChange={(e) => setBookingForm({...bookingForm, price_per_credit: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              value={bookingForm.notes}
              onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
              placeholder="Additional notes for the booking..."
            />
          </div>

          <Button onClick={createBooking} disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Booking'}
          </Button>
        </CardContent>
      </Card>

      {/* QR Code Testing */}
      <Card>
        <CardHeader>
          <CardTitle>QR Code Testing</CardTitle>
          <CardDescription>Test QR code generation and validation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter QR code to validate"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
            />
            <Button onClick={validateQRCode}>Validate QR Code</Button>
          </div>

          {qrValidation && (
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">QR Code Validation Result:</h4>
              <p><strong>Valid:</strong> {qrValidation.is_valid ? 'Yes' : 'No'}</p>
              {qrValidation.booking_id && <p><strong>Booking ID:</strong> {qrValidation.booking_id}</p>}
              {qrValidation.club_name && <p><strong>Club:</strong> {qrValidation.club_name}</p>}
              {qrValidation.user_name && <p><strong>User:</strong> {qrValidation.user_name}</p>}
              {qrValidation.status && <p><strong>Status:</strong> {qrValidation.status}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings List</CardTitle>
          <CardDescription>View and manage bookings</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No bookings found</div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.booking_id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{booking.club_name}</h4>
                      <p className="text-sm text-gray-600">{booking.booking_type}</p>
                    </div>
                    <Badge className={getStatusBadgeColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Start:</strong> {new Date(booking.scheduled_start).toLocaleString()}</p>
                      <p><strong>End:</strong> {new Date(booking.scheduled_end).toLocaleString()}</p>
                    </div>
                    <div>
                      <p><strong>Credits:</strong> {booking.credits_required}</p>
                      <p><strong>Amount:</strong> {booking.total_amount} MAD</p>
                    </div>
                  </div>

                  {booking.qr_code && (
                    <div className="mt-2">
                      <p className="text-sm"><strong>QR Code:</strong> {booking.qr_code}</p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    {booking.status === 'PENDING' && (
                      <Button size="sm" onClick={() => processBooking(booking.booking_id)}>
                        Process Booking
                      </Button>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <Button size="sm" onClick={() => generateQRCode(booking.booking_id)}>
                        Generate QR Code
                      </Button>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <Button size="sm" onClick={() => startSession(booking.booking_id)}>
                        Start Session
                      </Button>
                    )}
                    {booking.status === 'ACTIVE' && (
                      <Button size="sm" onClick={() => endSession(booking.booking_id)}>
                        End Session
                      </Button>
                    )}
                    {!['COMPLETED', 'CANCELLED'].includes(booking.status) && (
                      <Button size="sm" variant="destructive" onClick={() => cancelBooking(booking.booking_id)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsTest;
