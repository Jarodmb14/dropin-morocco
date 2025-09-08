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
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { QRScanner } from '@/components/QRScanner';
import { QRCodeGenerator } from '@/lib/qr-code';
import { Camera } from 'lucide-react';

const BookingsTest: React.FC = () => {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [qrValidation, setQrValidation] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);

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
    console.log('🚀 useEffect called');
    loadClubs();
    loadBookings(); // Re-enabled with better error handling
    checkAuth();
    console.log('✅ useEffect completed');
  }, []);

  const checkAuth = async () => {
    // Check if we have a stored session from our direct API login
    const storedSession = localStorage.getItem('supabase.auth.token');
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession);
        if (sessionData.user) {
          setUser({ id: sessionData.user.id, email: sessionData.user.email });
          console.log('✅ Restored user from stored session:', sessionData.user.email);
        }
      } catch (error) {
        console.log('❌ Error parsing stored session:', error);
        localStorage.removeItem('supabase.auth.token');
      }
    } else {
      console.log('ℹ️ No stored session found');
    }
  };

  const loadClubs = async () => {
    console.log('🚀 Loading clubs with multiple fallback strategies...');
    
    // Set mock clubs immediately first (guaranteed to work)
    console.log('📝 Setting mock clubs immediately...');
    const mockClubs = [
      { 
        id: 'mock-club-1', 
        name: 'Atlas Power Gym', 
        tier: 'STANDARD',
        city: 'Casablanca',
        address: 'Boulevard Mohammed V, Casablanca',
        latitude: 33.5731,
        longitude: -7.5898,
        amenities: ['cardio', 'weights', 'group_classes'],
        contact_phone: '+212522123456',
        contact_email: 'info@atlasgym.ma',
        is_active: true,
        owner_id: '7d8c6931-285d-4dee-9ba3-fbbe7ede4311',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: 'mock-club-2', 
        name: 'Casablanca Pro Fitness', 
        tier: 'PREMIUM',
        city: 'Casablanca',
        address: 'Anfa, Casablanca',
        latitude: 33.5589,
        longitude: -7.6678,
        amenities: ['cardio', 'weights', 'spa', 'personal_training'],
        contact_phone: '+212522456789',
        contact_email: 'info@pro-fitness.ma',
        is_active: true,
        owner_id: '7d8c6931-285d-4dee-9ba3-fbbe7ede4311',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: 'mock-club-3', 
        name: 'Rabat Champion Club', 
        tier: 'ULTRA_LUXE',
        city: 'Rabat',
        address: 'Agdal, Rabat',
        latitude: 34.0209,
        longitude: -6.8416,
        amenities: ['cardio', 'weights', 'spa', 'personal_training', 'tennis', 'swimming'],
        contact_phone: '+212537123456',
        contact_email: 'info@champion-club.ma',
        is_active: true,
        owner_id: '7d8c6931-285d-4dee-9ba3-fbbe7ede4311',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: 'mock-club-4', 
        name: 'Marrakech Fitness Center', 
        tier: 'STANDARD',
        city: 'Marrakech',
        address: 'Gueliz, Marrakech',
        latitude: 31.6295,
        longitude: -7.9811,
        amenities: ['cardio', 'weights', 'yoga'],
        contact_phone: '+212524123456',
        contact_email: 'info@marrakech-fitness.ma',
        is_active: true,
        owner_id: '7d8c6931-285d-4dee-9ba3-fbbe7ede4311',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: 'mock-club-5', 
        name: 'Tangier Beach Gym', 
        tier: 'PREMIUM',
        city: 'Tangier',
        address: 'Malabata, Tangier',
        latitude: 35.7473,
        longitude: -5.8342,
        amenities: ['cardio', 'weights', 'spa', 'pool', 'yoga'],
        contact_phone: '+212539123456',
        contact_email: 'info@tangier-beach.ma',
        is_active: true,
        owner_id: '7d8c6931-285d-4dee-9ba3-fbbe7ede4311',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    setClubs(mockClubs);
    console.log('✅ Mock clubs set immediately:', mockClubs.length, 'clubs');
    
    // Then try to get real clubs in the background
    try {
      console.log('📡 Trying to get real clubs from Supabase...');
      const { data, error } = await supabase
        .from('clubs')
        .select('*');
      
      console.log('📊 Supabase response:', { data: data?.length, error });
      
      if (!error && data && data.length > 0) {
        console.log('✅ Real clubs loaded, replacing mock clubs:', data.length, 'clubs');
        setClubs(data);
      } else {
        console.log('ℹ️ Keeping mock clubs, Supabase returned:', { data: data?.length, error });
      }
    } catch (error) {
      console.log('ℹ️ Supabase failed, keeping mock clubs:', error.message);
    }
  };

  const loadBookings = async () => {
    console.log('🔄 loadBookings called');
    try {
      // Use our working authentication method
      const storedSession = localStorage.getItem('supabase.auth.token');
      if (storedSession) {
        try {
          const sessionData = JSON.parse(storedSession);
          if (sessionData.user) {
            console.log('👤 User found in stored session, loading bookings...');
            
            // Use direct API to get bookings
            console.log('🔍 Loading bookings for user ID:', sessionData.user.id);
            const response = await fetch(`https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/bookings?user_id=eq.${sessionData.user.id}&select=*`, {
              headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE',
                'Authorization': `Bearer ${sessionData.access_token}`
              }
            });
            
            if (response.ok) {
              const bookingsData = await response.json();
              console.log('📊 Bookings loaded via direct API:', bookingsData?.length || 0);
              console.log('📊 Bookings for user', sessionData.user.id, ':', bookingsData);
              
              // Double-check: filter bookings to ensure they belong to the current user
              const userBookings = bookingsData?.filter((booking: any) => booking.user_id === sessionData.user.id) || [];
              console.log('✅ Filtered bookings for current user:', userBookings?.length || 0);
              
              setBookings(userBookings);
            } else {
              console.log('❌ Failed to load bookings:', response.status, response.statusText);
              
              // If 401, the token is invalid/expired
              if (response.status === 401) {
                console.log('🔐 Token expired or invalid, clearing stored session');
                localStorage.removeItem('supabase.auth.token');
                setUser(null);
                alert('Your session has expired. Please log in again.');
              }
              
              setBookings([]);
            }
          } else {
            console.log('👤 No user in stored session');
            setBookings([]);
          }
        } catch (parseError) {
          console.log('❌ Error parsing stored session:', parseError);
          setBookings([]);
        }
      } else {
        console.log('👤 No stored session found');
        setBookings([]);
      }
    } catch (error) {
      console.error('💥 Error in loadBookings:', error);
      setBookings([]);
    }
    console.log('✅ loadBookings completed');
  };

  const createBooking = async () => {
    console.log('🚀 createBooking function called!');
    alert('createBooking function called!');
    
    console.log('📝 Form data:', bookingForm);
    
    if (!bookingForm.club_id || !bookingForm.scheduled_start || !bookingForm.scheduled_end) {
      console.log('❌ Form validation failed:', {
        club_id: bookingForm.club_id,
        scheduled_start: bookingForm.scheduled_start,
        scheduled_end: bookingForm.scheduled_end
      });
      alert('Please fill in all required fields');
      return;
    }

    console.log('✅ Form validation passed');

    // Check if user is authenticated (using our manual session storage)
    console.log('🔐 Checking authentication...');
    
    // Check if we have a user in our local state
    if (!user) {
      console.log('❌ No user found in local state');
      alert('Please log in to create bookings');
      return;
    }
    
    console.log('✅ User authenticated:', user.email);

    setLoading(true);
    console.log('🔄 Loading state set to true');
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('⏰ Timeout reached, forcing loading to false');
      setLoading(false);
      alert('Booking creation timed out. Please try again.');
    }, 10000); // 10 second timeout

    try {
      console.log('🚀 Creating booking with data:', {
        ...bookingForm,
        user_id: user.id
      });
      console.log('🔍 Creating booking for user ID:', user.id);
      
           // Check if we're using a mock club ID
           if (bookingForm.club_id.startsWith('mock-club-')) {
             console.log('🎭 Mock club detected, creating mock booking...');
             
             // Create a mock booking for testing
             const mockBooking = {
               id: 'mock-booking-' + Date.now(),
               user_id: user.id,
               club_id: bookingForm.club_id,
               booking_type: bookingForm.booking_type,
               status: 'CONFIRMED',
               scheduled_start: bookingForm.scheduled_start,
               scheduled_end: bookingForm.scheduled_end,
               credits_required: bookingForm.credits_required,
               price_per_credit: bookingForm.price_per_credit,
               total_amount: bookingForm.credits_required * bookingForm.price_per_credit,
               notes: bookingForm.notes,
               special_requests: bookingForm.special_requests,
               equipment_reserved: bookingForm.equipment_reserved,
               qr_code: 'MOCK-QR-' + Date.now(),
               created_at: new Date().toISOString(),
               updated_at: new Date().toISOString()
             };
             
             console.log('✅ Mock booking created:', mockBooking);
             alert('Mock booking created successfully! (Testing with mock clubs)');
             
             // Generate QR code for the mock booking
             try {
               const qrCodeString = QRCodeGenerator.generateQRCodeString(mockBooking);
               setQrCode(qrCodeString);
               setSelectedBooking(mockBooking);
               console.log('✅ QR code generated for mock booking:', mockBooking.id);
             } catch (qrError) {
               console.log('⚠️ QR code generation failed:', qrError);
             }
             
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
             
             // Add to bookings list for display
             setBookings(prev => [mockBooking, ...prev]);
             console.log('✅ Mock booking added to list');
             
           } else {
             // Try real booking creation with direct API
             console.log('🏢 Real club detected, creating real booking with direct API...');
             
             try {
               // Get the stored session token (same approach as the working test)
               const storedSession = localStorage.getItem('supabase.auth.token');
               if (!storedSession) {
                 alert('No stored session found. Please log in first.');
                 return;
               }
               
               const sessionData = JSON.parse(storedSession);
               const authToken = sessionData.access_token;
               
               console.log('🔑 Using stored auth token:', authToken ? 'Present' : 'Missing');
               console.log('📡 Making booking request with auth token:', authToken ? 'Present' : 'Missing');
               
               const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/bookings', {
                 method: 'POST',
                 headers: {
                   'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE',
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${authToken}`
                 },
                 body: JSON.stringify({
                   user_id: user.id,
                   club_id: bookingForm.club_id,
                   booking_type: bookingForm.booking_type,
                   scheduled_start: bookingForm.scheduled_start,
                   scheduled_end: bookingForm.scheduled_end,
                   credits_required: bookingForm.credits_required,
                   price_per_credit: bookingForm.price_per_credit,
                   total_amount: bookingForm.credits_required * bookingForm.price_per_credit,
                   notes: bookingForm.notes,
                   special_requests: bookingForm.special_requests,
                   equipment_reserved: bookingForm.equipment_reserved,
                   status: 'CONFIRMED'
                 })
               });
               
               if (response.ok) {
                 // Try to get response data, but handle cases where response is empty
                 let newBooking = null;
                 try {
                   const responseText = await response.text();
                   console.log('📄 Raw response text:', responseText);
                   
                   if (responseText) {
                     newBooking = JSON.parse(responseText);
                   }
                 } catch (parseError) {
                   console.log('❌ Failed to parse success response:', parseError);
                 }
                 
                 console.log('✅ Real booking created:', newBooking);
                 alert('Real booking created successfully!');
                 
                 // Generate QR code for the new booking
                 try {
                   const qrCodeString = QRCodeGenerator.generateQRCodeString(newBooking);
                   setQrCode(qrCodeString);
                   setSelectedBooking(newBooking);
                   console.log('✅ QR code generated for booking:', newBooking.id || newBooking.booking_id);
                 } catch (qrError) {
                   console.log('⚠️ QR code generation failed:', qrError);
                 }
                 
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
                 // Try to get error data, but handle cases where response is empty
                 let errorData = null;
                 try {
                   const responseText = await response.text();
                   console.log('📄 Raw response text:', responseText);
                   
                   if (responseText) {
                     errorData = JSON.parse(responseText);
                   }
                 } catch (parseError) {
                   console.log('❌ Failed to parse error response:', parseError);
                 }
                 
                 console.log('❌ Real booking creation failed:', {
                   status: response.status,
                   statusText: response.statusText,
                   error: errorData,
                   headers: Object.fromEntries(response.headers.entries())
                 });
                 
                 const errorMessage = errorData?.message || errorData?.msg || response.statusText || 'Unknown error';
                 alert(`Real booking creation failed (${response.status}): ${errorMessage}`);
               }
             } catch (apiError) {
               console.log('💥 Real booking API error:', apiError);
               alert('Real booking API error: ' + apiError.message);
             }
           }
    } catch (error) {
      console.error('💥 Error creating booking:', error);
      console.error('💥 Error details:', {
        message: (error as Error).message,
        stack: (error as Error).stack,
        name: (error as Error).name
      });
      alert('Error creating booking: ' + (error as Error).message);
    } finally {
      clearTimeout(timeoutId);
      console.log('🔄 Setting loading to false');
      setLoading(false);
      console.log('✅ Loading state set to false');
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
            <Button 
              onClick={async () => {
                try {
                  const storedSession = localStorage.getItem('supabase.auth.token');
                  if (!storedSession) {
                    alert('No stored session found. Please log in first.');
                    return;
                  }
                  
                  const sessionData = JSON.parse(storedSession);
                  console.log('🔍 Current session data:', sessionData);
                  
                  // Test the token by making a simple API call
                  const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/bookings?select=count', {
                    headers: {
                      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE',
                      'Authorization': `Bearer ${sessionData.access_token}`
                    }
                  });
                  
                  console.log('🔍 Token test response:', response.status, response.statusText);
                  
                  if (response.ok) {
                    alert(`✅ Token is valid! Status: ${response.status}`);
                  } else {
                    alert(`❌ Token is invalid! Status: ${response.status} ${response.statusText}`);
                    if (response.status === 401) {
                      localStorage.removeItem('supabase.auth.token');
                      setUser(null);
                    }
                  }
                } catch (error) {
                  console.error('Token test error:', error);
                  alert('Error testing token: ' + (error as Error).message);
                }
              }}
              variant="outline"
              disabled={loading}
            >
              Test Auth Token
            </Button>
            <Button 
              onClick={async () => {
                try {
                  setLoading(true);
                  
                  // Get the stored session token
                  const storedSession = localStorage.getItem('supabase.auth.token');
                  if (!storedSession) {
                    alert('No stored session found. Please log in first.');
                    return;
                  }
                  
                  const sessionData = JSON.parse(storedSession);
                  const authToken = sessionData.access_token;
                  
                  // Load ALL bookings (no user filter) to see what's in the database
                  const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/bookings?select=*', {
                    headers: {
                      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE',
                      'Authorization': `Bearer ${authToken}`
                    }
                  });
                  
                  if (response.ok) {
                    const allBookings = await response.json();
                    console.log('📊 ALL bookings in database:', allBookings);
                    console.log('📊 Total bookings count:', allBookings?.length || 0);
                    
                    // Show user IDs of all bookings
                    const userIds = allBookings?.map((b: any) => b.user_id) || [];
                    console.log('👥 User IDs in bookings:', [...new Set(userIds)]);
                    
                    // Show current user ID
                    console.log('👤 Current user ID:', sessionData.user.id);
                    
                    // Check if current user has any bookings
                    const currentUserBookings = allBookings?.filter((b: any) => b.user_id === sessionData.user.id) || [];
                    console.log('✅ Current user bookings:', currentUserBookings?.length || 0);
                    
                    alert(`Found ${allBookings?.length || 0} total bookings. Your bookings: ${currentUserBookings?.length || 0}. Check console for details.`);
                  } else {
                    const errorText = await response.text();
                    console.log('❌ Failed to load all bookings:', response.status, errorText);
                    alert(`Failed to load all bookings: ${response.status} ${response.statusText}`);
                  }
                } catch (error) {
                  console.error('💥 Error loading all bookings:', error);
                  alert('Error loading all bookings: ' + (error as Error).message);
                } finally {
                  setLoading(false);
                }
              }}
              variant="outline"
              disabled={loading}
            >
              Debug Bookings
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
                  amenities: ['cardio', 'weights'] as any,
                  contact_phone: '+212522123456',
                  contact_email: 'test@gym.com',
                  is_active: true,
                  owner_id: '7d8c6931-285d-4dee-9ba3-fbbe7ede4311'
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
                  console.log('🔐 Attempting login with direct API:', email);
                  
                  // Use direct API call instead of Supabase client
                  const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/auth/v1/token?grant_type=password', {
                    method: 'POST',
                    headers: {
                      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                  });
                  
                  if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Login successful!', data);
                    alert('Login successful!');
                    
                    // Store the session manually
                    localStorage.setItem('supabase.auth.token', JSON.stringify(data));
                    
                    // Update user state
                    setUser({ id: data.user.id, email: data.user.email });
                    loadBookings(); // Reload bookings after login
                  } else {
                    const errorData = await response.json();
                    console.log('❌ Login error:', errorData);
                    alert('Login failed: ' + (errorData.msg || errorData.message || 'Unknown error'));
                  }
                } catch (err) {
                  console.log('💥 Login exception:', err);
                  alert('Login error: ' + (err as Error).message);
                }
              }
            }}>
              Quick Login
            </Button>
            <Button variant="outline" onClick={async () => {
              const email = (document.getElementById('test-email') as HTMLInputElement)?.value;
              const password = (document.getElementById('test-password') as HTMLInputElement)?.value;
              if (email && password) {
                try {
                  console.log('📝 Creating test user with direct API:', email);
                  
                  // Use direct API call instead of Supabase client
                  const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/auth/v1/signup', {
                    method: 'POST',
                    headers: {
                      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                      email, 
                      password,
                      data: {
                        role: 'CUSTOMER'
                      }
                    })
                  });
                  
                  if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Signup successful!', data);
                    alert('Test user created! Now try logging in.');
                  } else {
                    const errorData = await response.json();
                    console.log('❌ Signup error:', errorData);
                    alert('Signup failed: ' + (errorData.msg || errorData.message || 'Unknown error'));
                  }
                } catch (err) {
                  console.log('💥 Signup exception:', err);
                  alert('Signup error: ' + (err as Error).message);
                }
              }
            }}>
              Create Test User
            </Button>
            <Button variant="outline" onClick={async () => {
              try {
                console.log('🔄 Attempting logout...');
                
                // Clear localStorage to remove corrupted session data
                localStorage.clear();
                console.log('🧹 Cleared localStorage');
                
                // Clear user state
                setUser(null);
                setBookings([]);
                
                alert('Logged out successfully! localStorage cleared.');
                
                // Force reload to clear any cached auth state
                window.location.reload();
              } catch (err) {
                console.error('💥 Logout exception:', err);
                alert('Logout error: ' + (err as Error).message);
              }
            }}>
              Logout & Clear Storage
            </Button>
            <Button variant="outline" onClick={async () => {
              try {
                console.log('🔍 Testing Supabase connection...');
                
                // Test 1: Direct fetch to Supabase REST API
                console.log('📡 Testing direct fetch...');
                const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/clubs?select=count&limit=1', {
                  headers: {
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE',
                    'Content-Type': 'application/json'
                  }
                });
                
                if (response.ok) {
                  const data = await response.json();
                  console.log('✅ Direct fetch successful:', data);
                  alert('Direct fetch works! Data: ' + JSON.stringify(data));
                } else {
                  console.log('❌ Direct fetch failed:', response.status, response.statusText);
                  alert('Direct fetch failed: ' + response.status + ' ' + response.statusText);
                }
                
                // Test 2: Supabase client with timeout
                console.log('📡 Testing Supabase client...');
                try {
                  const clientPromise = supabase.from('clubs').select('count').limit(1);
                  const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Supabase client timeout after 5 seconds')), 5000)
                  );
                  
                  const result = await Promise.race([clientPromise, timeoutPromise]);
                  const { data, error } = result as any;
                  
                  if (error) {
                    console.log('❌ Supabase client error:', error);
                    alert('Supabase client failed: ' + error.message);
                  } else {
                    console.log('✅ Supabase client successful:', data);
                    alert('Supabase client works! Data: ' + JSON.stringify(data));
                  }
                } catch (clientError) {
                  console.log('💥 Supabase client exception:', clientError);
                  alert('Supabase client error: ' + clientError.message);
                }
              } catch (err) {
                console.log('💥 Test exception:', err);
                alert('Test error: ' + (err as Error).message);
              }
            }}>
              Test Supabase
            </Button>
            <Button variant="outline" onClick={async () => {
              try {
                console.log('🔑 Testing authentication token...');
                
                // Check stored session
                const storedSession = localStorage.getItem('supabase.auth.token');
                console.log('📦 Stored session:', storedSession ? 'Present' : 'Missing');
                
                if (storedSession) {
                  try {
                    const sessionData = JSON.parse(storedSession);
                    console.log('🔍 Session data:', {
                      hasAccessToken: !!sessionData.access_token,
                      hasUser: !!sessionData.user,
                      userEmail: sessionData.user?.email,
                      tokenLength: sessionData.access_token?.length
                    });
                    
                    // Test authenticated request with correct endpoint
                    const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/auth/v1/user', {
                      headers: {
                        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE',
                        'Authorization': `Bearer ${sessionData.access_token}`
                      }
                    });
                    
                    if (response.ok) {
                      const userData = await response.json();
                      console.log('✅ Auth token valid:', userData);
                      alert('Auth token is valid! User: ' + userData.email);
                    } else {
                      console.log('❌ Auth token invalid:', response.status, response.statusText);
                      alert('Auth token is invalid: ' + response.status);
                    }
                  } catch (error) {
                    console.log('💥 Error parsing session:', error);
                    alert('Error parsing session: ' + error.message);
                  }
                } else {
                  alert('No stored session found. Please log in first.');
                }
              } catch (err) {
                console.log('💥 Auth test exception:', err);
                alert('Auth test error: ' + (err as Error).message);
              }
            }}>
              Test Auth Token
            </Button>
            <Button variant="outline" onClick={async () => {
              try {
                console.log('🧪 Testing booking creation with auth...');
                
                // Get stored session
                const storedSession = localStorage.getItem('supabase.auth.token');
                if (!storedSession) {
                  alert('No stored session found. Please log in first.');
                  return;
                }
                
                const sessionData = JSON.parse(storedSession);
                const authToken = sessionData.access_token;
                
                // First, let's get a real club ID to test with
                console.log('📡 Getting real club ID...');
                const clubsResponse = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/clubs?select=id&limit=1', {
                  headers: {
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE',
                    'Content-Type': 'application/json'
                  }
                });
                
                let realClubId = 'test-club-id';
                if (clubsResponse.ok) {
                  const clubsData = await clubsResponse.json();
                  if (clubsData && clubsData.length > 0) {
                    realClubId = clubsData[0].id;
                    console.log('✅ Using real club ID:', realClubId);
                  }
                }
                
                // Test booking creation with authentication
                const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/bookings', {
                  method: 'POST',
                  headers: {
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                  },
                  body: JSON.stringify({
                    user_id: sessionData.user.id, // Use the actual logged-in user ID
                    club_id: realClubId,
                    booking_type: 'SINGLE_SESSION',
                    scheduled_start: '2025-09-06T10:00:00Z',
                    scheduled_end: '2025-09-06T12:00:00Z',
                    credits_required: 1,
                    price_per_credit: 10.00,
                    total_amount: 10.00,
                    status: 'CONFIRMED'
                  })
                });
                
                console.log('📊 Response status:', response.status, response.statusText);
                
                if (response.ok) {
                  // Try to get response data, but handle cases where response is empty
                  let data = null;
                  try {
                    const responseText = await response.text();
                    console.log('📄 Raw response text:', responseText);
                    
                    if (responseText) {
                      data = JSON.parse(responseText);
                    }
                  } catch (parseError) {
                    console.log('❌ Failed to parse success response:', parseError);
                  }
                  
                  console.log('✅ Booking creation works with auth:', data);
                  alert('Booking creation works with auth! RLS policies require authentication.');
                } else {
                  // Try to get error data, but handle cases where response is empty
                  let errorData = null;
                  try {
                    const responseText = await response.text();
                    console.log('📄 Raw response text:', responseText);
                    
                    if (responseText) {
                      errorData = JSON.parse(responseText);
                    }
                  } catch (parseError) {
                    console.log('❌ Failed to parse error response:', parseError);
                  }
                  
                  console.log('❌ Booking creation failed without auth:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData,
                    headers: Object.fromEntries(response.headers.entries())
                  });
                  
                  const errorMessage = errorData?.message || errorData?.msg || response.statusText || 'Unknown error';
                  alert(`Booking creation failed without auth (${response.status}): ${errorMessage}`);
                }
              } catch (err) {
                console.log('💥 Booking test exception:', err);
                alert('Booking test error: ' + (err as Error).message);
              }
            }}>
              Test Booking (With Auth)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
            <strong>Clubs Count:</strong> {clubs.length}<br/>
            <strong>Clubs Data:</strong> {JSON.stringify(clubs.slice(0, 2), null, 2)}<br/>
            <strong>User:</strong> {user ? user.email : 'Not logged in'}<br/>
            <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
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
                  {clubs.length === 0 ? (
                    <SelectItem value="no-clubs" disabled>
                      No clubs available (Debug: {clubs.length} clubs)
                    </SelectItem>
                  ) : (
                    clubs.map((club) => (
                      <SelectItem key={club.id} value={club.id}>
                        {club.name} ({club.tier})
                      </SelectItem>
                    ))
                  )}
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
          
          <Button onClick={() => {
            console.log('🧪 Test button clicked!');
            alert('Test button works!');
          }} className="w-full mt-2" variant="outline">
            Test Button
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
              <p><strong>Valid:</strong> {qrValidation.valid ? 'Yes' : 'No'}</p>
              {qrValidation.data?.bookingId && <p><strong>Booking ID:</strong> {qrValidation.data.bookingId}</p>}
              {qrValidation.data?.clubId && <p><strong>Club ID:</strong> {qrValidation.data.clubId}</p>}
              {qrValidation.data?.userId && <p><strong>User ID:</strong> {qrValidation.data.userId}</p>}
              {qrValidation.data?.status && <p><strong>Status:</strong> {qrValidation.data.status}</p>}
              {qrValidation.data?.scheduledStart && <p><strong>Valid From:</strong> {new Date(qrValidation.data.scheduledStart).toLocaleString()}</p>}
              {qrValidation.data?.scheduledEnd && <p><strong>Valid Until:</strong> {new Date(qrValidation.data.scheduledEnd).toLocaleString()}</p>}
              <p><strong>Message:</strong> {qrValidation.message}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Bookings</CardTitle>
              <CardDescription>
                {user ? `Bookings for ${user.email} (${user.id})` : 'Please log in to view your bookings'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={async () => {
                  if (!confirm('Are you sure you want to delete ALL bookings? This cannot be undone!')) {
                    return;
                  }
                  
                  try {
                    setLoading(true);
                    
                    // Get the stored session token
                    const storedSession = localStorage.getItem('supabase.auth.token');
                    if (!storedSession) {
                      alert('No stored session found. Please log in first.');
                      return;
                    }
                    
                    const sessionData = JSON.parse(storedSession);
                    const authToken = sessionData.access_token;
                    
                    // Delete all bookings with proper WHERE clause (required by Supabase)
                    const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/bookings?id=gt.0', {
                      method: 'DELETE',
                      headers: {
                        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE',
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                      }
                    });
                    
                    console.log('🗑️ Delete response status:', response.status);
                    console.log('🗑️ Delete response headers:', Object.fromEntries(response.headers.entries()));
                    
                    if (response.ok) {
                      alert('All bookings deleted successfully!');
                      setBookings([]);
                      setQrCode('');
                      setSelectedBooking(null);
                      setQrValidation(null);
                    } else {
                      // Try to get detailed error information
                      let errorData = null;
                      try {
                        const responseText = await response.text();
                        console.log('📄 Raw delete response text:', responseText);
                        
                        if (responseText) {
                          errorData = JSON.parse(responseText);
                        }
                      } catch (parseError) {
                        console.log('❌ Failed to parse delete error response:', parseError);
                      }
                      
                      console.log('❌ Delete failed:', {
                        status: response.status,
                        statusText: response.statusText,
                        error: errorData,
                        headers: Object.fromEntries(response.headers.entries())
                      });
                      
                      const errorMessage = errorData?.message || errorData?.msg || response.statusText || 'Unknown error';
                      alert(`Failed to delete bookings (${response.status}): ${errorMessage}`);
                    }
                  } catch (error) {
                    console.error('💥 Error deleting bookings:', error);
                    alert('Error deleting bookings: ' + (error as Error).message);
                  } finally {
                    setLoading(false);
                  }
                }}
                variant="destructive"
                disabled={loading}
                size="sm"
              >
                Clear All Bookings
              </Button>
              
              <Button 
                onClick={async () => {
                  if (!confirm('Are you sure you want to delete YOUR bookings only? This cannot be undone!')) {
                    return;
                  }
                  
                  try {
                    setLoading(true);
                    
                    // Get the stored session token
                    const storedSession = localStorage.getItem('supabase.auth.token');
                    if (!storedSession) {
                      alert('No stored session found. Please log in first.');
                      return;
                    }
                    
                    const sessionData = JSON.parse(storedSession);
                    const authToken = sessionData.access_token;
                    
                    // Validate user ID format first
                    console.log('🔍 User ID to delete:', sessionData.user.id);
                    console.log('🔍 User ID type:', typeof sessionData.user.id);
                    
                    if (!sessionData.user.id || sessionData.user.id === '0' || sessionData.user.id === '') {
                      alert('Invalid user ID. Please log in again.');
                      return;
                    }
                    
                    // Delete only current user's bookings
                    const response = await fetch(`https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/bookings?user_id=eq.${sessionData.user.id}`, {
                      method: 'DELETE',
                      headers: {
                        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE',
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                      }
                    });
                    
                    console.log('🗑️ Delete user bookings response status:', response.status);
                    
                    if (response.ok) {
                      alert('Your bookings deleted successfully!');
                      setBookings([]);
                      setQrCode('');
                      setSelectedBooking(null);
                      setQrValidation(null);
                    } else {
                      const errorText = await response.text();
                      console.log('❌ Delete user bookings failed:', response.status, errorText);
                      alert(`Failed to delete your bookings (${response.status}): ${errorText}`);
                    }
                  } catch (error) {
                    console.error('💥 Error deleting user bookings:', error);
                    alert('Error deleting your bookings: ' + (error as Error).message);
                  } finally {
                    setLoading(false);
                  }
                }}
                variant="outline"
                disabled={loading}
                size="sm"
              >
                Clear My Bookings
              </Button>
              
              <Button 
                onClick={async () => {
                  if (!confirm('Are you sure you want to delete ALL bookings in the database? This cannot be undone!')) {
                    return;
                  }
                  
                  try {
                    setLoading(true);
                    
                    // Get the stored session token
                    const storedSession = localStorage.getItem('supabase.auth.token');
                    if (!storedSession) {
                      alert('No stored session found. Please log in first.');
                      return;
                    }
                    
                    const sessionData = JSON.parse(storedSession);
                    const authToken = sessionData.access_token;
                    
                    // Delete ALL bookings using the working method with timeout
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
                    
                    const response = await fetch('https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/bookings?id=gt.0', {
                      method: 'DELETE',
                      headers: {
                        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE',
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                      },
                      signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);
                    
                    console.log('🗑️ Delete ALL bookings response status:', response.status);
                    
                    if (response.ok) {
                      alert('ALL bookings deleted successfully!');
                      setBookings([]);
                      setQrCode('');
                      setSelectedBooking(null);
                      setQrValidation(null);
                    } else {
                      const errorText = await response.text();
                      console.log('❌ Delete ALL bookings failed:', response.status, errorText);
                      alert(`Failed to delete ALL bookings (${response.status}): ${errorText}`);
                    }
                  } catch (error) {
                    console.error('💥 Error deleting ALL bookings:', error);
                    
                    if (error instanceof Error) {
                      if (error.name === 'AbortError') {
                        alert('Request timed out. Please try again or use the SQL method below.');
                      } else if (error.message.includes('Failed to fetch')) {
                        alert('Network error. Please check your connection or use the SQL method below.');
                      } else {
                        alert('Error deleting ALL bookings: ' + error.message);
                      }
                    } else {
                      alert('Unknown error occurred while deleting bookings.');
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
                variant="destructive"
                disabled={loading}
                size="sm"
              >
                Clear ALL Bookings
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              {user ? `No bookings found for ${user.email}` : 'Please log in to view your bookings'}
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id || booking.booking_id} className="border rounded-lg p-4">
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
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        try {
                          const qrCodeString = QRCodeGenerator.generateQRCodeString(booking);
                          setQrCode(qrCodeString);
                          setSelectedBooking(booking);
                          console.log('✅ QR code generated for existing booking:', booking.id || booking.booking_id);
                        } catch (qrError) {
                          console.log('⚠️ QR code generation failed:', qrError);
                          alert('Failed to generate QR code');
                        }
                      }}
                    >
                      Show QR Code
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SQL Commands for Manual Clearing */}
      <Card>
        <CardHeader>
          <CardTitle>Manual SQL Commands</CardTitle>
          <CardDescription>
            If the buttons above don't work, you can run these SQL commands directly in your Supabase dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">1. Check current bookings:</h4>
            <code className="text-sm bg-white p-2 rounded block">
              SELECT COUNT(*) as total_bookings FROM bookings;
            </code>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">2. Clear ALL bookings:</h4>
            <code className="text-sm bg-white p-2 rounded block">
              DELETE FROM bookings;
            </code>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">3. Verify deletion:</h4>
            <code className="text-sm bg-white p-2 rounded block">
              SELECT COUNT(*) as remaining_bookings FROM bookings;
            </code>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> Go to your Supabase dashboard → SQL Editor → Run these commands one by one
            </p>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Display */}
      {selectedBooking && (
        <Card>
          <CardHeader>
            <CardTitle>QR Code for Gym Access</CardTitle>
            <CardDescription>
              Show this QR code at the gym entrance during your scheduled time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QRCodeDisplay 
              booking={selectedBooking} 
              onRefresh={() => {
                // Refresh the QR code
                try {
                  const qrCodeString = QRCodeGenerator.generateQRCodeString(selectedBooking);
                  setQrCode(qrCodeString);
                } catch (qrError) {
                  console.log('⚠️ QR code refresh failed:', qrError);
                }
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* QR Code Testing Tools */}
      <Card>
        <CardHeader>
          <CardTitle>QR Code Testing Tools</CardTitle>
          <CardDescription>Generate test QR codes and test scanning functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => {
                // Generate a test QR code for immediate scanning
                const testQR = JSON.stringify({
                  bookingId: 'test-booking-' + Date.now(),
                  userId: user?.id || 'test-user-id',
                  clubId: 'test-club-id',
                  scheduledStart: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
                  scheduledEnd: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
                  status: 'CONFIRMED',
                  timestamp: new Date().toISOString()
                });
                
                setQrCode(testQR);
                setSelectedBooking({
                  id: 'test-booking-' + Date.now(),
                  booking_id: 'test-booking-' + Date.now(),
                  user_id: user?.id || 'test-user-id',
                  club_id: 'test-club-id',
                  status: 'CONFIRMED',
                  scheduled_start: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                  scheduled_end: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
                  club_name: 'Test Gym'
                });
                setQrValidation({
                  valid: true,
                  data: JSON.parse(testQR),
                  message: 'Test QR code generated - ready for scanning!'
                });
                
                console.log('🧪 Test QR code generated:', testQR);
                alert('Test QR code generated! You can now scan it or download it.');
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Generate Test QR
            </Button>
            
            <Button 
              onClick={() => setShowScanner(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Scan QR Code
            </Button>
            
            {qrCode && (
              <Button 
                onClick={() => {
                  setQrCode('');
                  setSelectedBooking(null);
                  setQrValidation(null);
                }}
                variant="destructive"
              >
                Clear QR Code
              </Button>
            )}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> Click "Generate Test QR" to create a test QR code, 
              then click "Scan QR Code" to test the camera scanner. Point your camera at the 
              generated QR code to test the scanning functionality.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Actions */}
      {qrCode && (
        <Card>
          <CardHeader>
            <CardTitle>QR Code Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={() => {
                  // Copy QR code data to clipboard
                  navigator.clipboard.writeText(qrCode);
                  alert('QR code data copied to clipboard!');
                }}
                variant="outline"
              >
                Copy QR Data
              </Button>
              <Button 
                onClick={() => {
                  // Validate QR code
                  const qrData = QRCodeGenerator.parseQRCodeData(qrCode);
                  if (qrData) {
                    const isValid = QRCodeGenerator.isQRCodeValid(qrData);
                    setQrValidation({
                      valid: isValid,
                      data: qrData,
                      message: isValid ? 'QR code is valid for gym access' : 'QR code is expired or not yet valid'
                    });
                  } else {
                    setQrValidation({
                      valid: false,
                      data: null,
                      message: 'Invalid QR code format'
                    });
                  }
                }}
                variant="outline"
              >
                Validate QR Code
              </Button>
              <Button 
                onClick={() => {
                  setQrCode('');
                  setSelectedBooking(null);
                  setQrValidation(null);
                }}
                variant="destructive"
              >
                Clear QR Code
              </Button>
              <Button 
                onClick={() => setShowScanner(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Scan QR Code
              </Button>
              <Button 
                onClick={() => {
                  // Generate a test QR code for immediate scanning
                  const testQR = JSON.stringify({
                    bookingId: 'test-booking-' + Date.now(),
                    userId: user?.id || 'test-user-id',
                    clubId: 'test-club-id',
                    scheduledStart: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
                    scheduledEnd: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
                    status: 'CONFIRMED',
                    timestamp: new Date().toISOString()
                  });
                  
                  setQrCode(testQR);
                  setQrValidation({
                    valid: true,
                    data: JSON.parse(testQR),
                    message: 'Test QR code generated - ready for scanning!'
                  });
                  
                  console.log('🧪 Test QR code generated:', testQR);
                  alert('Test QR code generated! You can now scan it or download it.');
                }}
                variant="outline"
                size="sm"
              >
                Generate Test QR
              </Button>
            </div>
            
            {/* Test Validation Scenarios */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Test Validation Scenarios:</h4>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  onClick={() => {
                    // Test with invalid QR code
                    const invalidQR = 'INVALID-QR-CODE-TEST';
                    const qrData = QRCodeGenerator.parseQRCodeData(invalidQR);
                    setQrValidation({
                      valid: false,
                      data: null,
                      message: 'Invalid QR code format (test)'
                    });
                    console.log('🧪 Testing invalid QR code:', invalidQR);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Test Invalid QR
                </Button>
                
                <Button 
                  onClick={() => {
                    // Test with expired QR code
                    const expiredQR = JSON.stringify({
                      bookingId: 'test-booking-id',
                      userId: 'test-user-id',
                      clubId: 'test-club-id',
                      scheduledStart: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
                      scheduledEnd: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                      status: 'CONFIRMED',
                      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                    });
                    
                    const qrData = QRCodeGenerator.parseQRCodeData(expiredQR);
                    if (qrData) {
                      const isValid = QRCodeGenerator.isQRCodeValid(qrData);
                      setQrValidation({
                        valid: isValid,
                        data: qrData,
                        message: isValid ? 'QR code is valid for gym access' : 'QR code is expired (test)'
                      });
                    }
                    console.log('🧪 Testing expired QR code:', expiredQR);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Test Expired QR
                </Button>
                
                <Button 
                  onClick={() => {
                    // Test with future QR code
                    const futureQR = JSON.stringify({
                      bookingId: 'test-booking-id',
                      userId: 'test-user-id',
                      clubId: 'test-club-id',
                      scheduledStart: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
                      scheduledEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
                      status: 'CONFIRMED',
                      timestamp: new Date().toISOString()
                    });
                    
                    const qrData = QRCodeGenerator.parseQRCodeData(futureQR);
                    if (qrData) {
                      const isValid = QRCodeGenerator.isQRCodeValid(qrData);
                      setQrValidation({
                        valid: isValid,
                        data: qrData,
                        message: isValid ? 'QR code is valid for gym access' : 'QR code is not yet valid (test)'
                      });
                    }
                    console.log('🧪 Testing future QR code:', futureQR);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Test Future QR
                </Button>
                
                <Button 
                  onClick={() => {
                    // Test with current valid QR code
                    const currentQR = JSON.stringify({
                      bookingId: 'test-booking-id',
                      userId: 'test-user-id',
                      clubId: 'test-club-id',
                      scheduledStart: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
                      scheduledEnd: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
                      status: 'CONFIRMED',
                      timestamp: new Date().toISOString()
                    });
                    
                    const qrData = QRCodeGenerator.parseQRCodeData(currentQR);
                    if (qrData) {
                      const isValid = QRCodeGenerator.isQRCodeValid(qrData);
                      setQrValidation({
                        valid: isValid,
                        data: qrData,
                        message: isValid ? 'QR code is valid for gym access (test)' : 'QR code is not valid'
                      });
                    }
                    console.log('🧪 Testing current valid QR code:', currentQR);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Test Valid QR
                </Button>
              </div>
            </div>
            
            {qrValidation && (
              <div className={`p-3 rounded-lg border ${
                qrValidation.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <p className={`text-sm ${
                  qrValidation.valid ? 'text-green-800' : 'text-red-800'
                }`}>
                  {qrValidation.message}
                </p>
                {qrValidation.data && (
                  <div className="mt-2 text-xs text-gray-600">
                    <strong>Booking ID:</strong> {qrValidation.data.bookingId}<br/>
                    <strong>Valid from:</strong> {new Date(qrValidation.data.scheduledStart).toLocaleString()}<br/>
                    <strong>Valid until:</strong> {new Date(qrValidation.data.scheduledEnd).toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <QRScanner
            onQRCodeScanned={(qrData) => {
              console.log('📱 QR Code scanned from camera:', qrData);
              setQrCode(qrData);
              setShowScanner(false);
              
              // Validate the scanned QR code
              const parsedData = QRCodeGenerator.parseQRCodeData(qrData);
              if (parsedData) {
                const isValid = QRCodeGenerator.isQRCodeValid(parsedData);
                setQrValidation({
                  valid: isValid,
                  data: parsedData,
                  message: isValid ? 'QR code is valid for gym access' : 'QR code is expired or not yet valid'
                });
              } else {
                setQrValidation({
                  valid: false,
                  data: null,
                  message: 'Invalid QR code format'
                });
              }
            }}
            onClose={() => setShowScanner(false)}
          />
        </div>
      )}
    </div>
  );
};

export default BookingsTest;
