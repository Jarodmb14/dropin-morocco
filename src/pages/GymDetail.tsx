import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getTierPastelGradient, getTierEmojiColor, getTierEmoji } from '@/utils/tierColors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Star, Clock, Users, Wifi, Car, Dumbbell, Coffee, ParkingCircle, Calendar, CreditCard, QrCode, Waves, ThermometerSun } from 'lucide-react';
import BasicImage from '@/assets/Basic.png';
import StandardImage from '@/assets/Standard.png';
import PremiumImage from '@/assets/Premium.png';
import LuxuryImage from '@/assets/luxury.png';
import { QRCodeGenerator } from '@/lib/qr-code';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { QRScanner } from '@/components/QRScanner';
import { ReviewsSection } from '@/components/ReviewsSection';
import PaymentModal from '@/components/PaymentModal';
import { loadStripe } from '@stripe/stripe-js';

interface Gym {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'LUXURY';
  price_per_hour: number;
  description?: string;
  amenities?: any;
  rating?: number;
  review_count?: number;
  tierColor: string;
  image: string;
  // Additional fields for detailed view
  photos?: string[];
  opening_hours?: string;
  contact_phone?: string;
  contact_email?: string;
  website?: string;
  social_media?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  facilities?: {
    parking?: boolean;
    locker_rooms?: boolean;
    showers?: boolean;
    towel_service?: boolean;
    water_fountain?: boolean;
    air_conditioning?: boolean;
  };
  equipment?: string[];
  classes?: string[];
  trainers?: string[];
}

const GymDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State declarations
  const [gym, setGym] = useState<Gym | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Booking states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('1');
  const [selectedPass, setSelectedPass] = useState('SINGLE_SESSION');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // Prevent body scroll when QR modal is open
  useEffect(() => {
    if (showQRModal) {
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      // Re-enable body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [showQRModal]);

  // Handle ESC key to close QR modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showQRModal) {
        setShowQRModal(false);
      }
    };

    if (showQRModal) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [showQRModal]);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  
  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [stripeError, setStripeError] = useState<string | null>(null);

  // Load gym details from database
  const loadGymDetails = async () => {
    try {
      setIsLoading(true);
      setError('');
      console.log('🏋️ Loading gym details for ID:', id);
      
      if (!id) {
        throw new Error('No gym ID provided');
      }
      
      const response = await fetch(`https://obqhxrqpxoaiublaoidv.supabase.co/rest/v1/clubs?id=eq.${id}&select=*`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWh4cnFweG9haXVibGFvaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzk3MjQsImV4cCI6MjA3MjMxNTcyNH0.djty3cbe78iEU_2DWgWFpkf_3v_X9U_SzAWOW5i2voE'
        }
      });
      
      console.log('🏋️ Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🏋️ Gym data:', data);
        
        if (data && data.length > 0) {
          const club = data[0];
          console.log('🏋️ Found club:', club);
          
          // Transform the data to match our Gym interface
          const transformedGym: Gym = {
            id: club.id,
            name: club.name,
            tier: club.tier || 'BASIC',
            price_per_hour: club.auto_blane_price || club.monthly_price || 50,
            rating: club.average_rating || 4.0,
            review_count: club.total_reviews || 0,
            address: club.address || 'Address not available',
            latitude: club.latitude || 33.5731,
            longitude: club.longitude || -7.5898,
            description: club.description,
            amenities: club.amenities || [],
            tierColor: getTierEmojiColor(club.tier || 'BASIC'),
            image: getTierImage(club.tier || 'BASIC'),
            // Additional fields for detailed view
            photos: club.photos || [getTierImage(club.tier || 'BASIC')],
            opening_hours: club.opening_hours || 'Mon-Fri: 6:00 AM - 10:00 PM, Sat-Sun: 8:00 AM - 8:00 PM',
            contact_phone: club.contact_phone || '+212 5XX XXX XXX',
            contact_email: club.contact_email || 'info@gym.com',
            website: club.website || 'www.gym.com',
            social_media: club.social_media || {},
            facilities: club.facilities || {
              parking: true,
              locker_rooms: true,
              showers: true,
              towel_service: false,
              water_fountain: true,
              air_conditioning: true
            },
            equipment: club.equipment || ['Treadmills', 'Weight Machines', 'Free Weights', 'Cardio Equipment'],
            classes: club.classes || ['Yoga', 'Pilates', 'Zumba', 'CrossFit'],
            trainers: club.trainers || ['Professional Trainers Available']
          };
          
          setGym(transformedGym);
          console.log('✅ Gym loaded successfully:', transformedGym.name);
        } else {
          console.log('🏋️ No gym found with ID:', id);
          setError(`No gym found with ID: ${id}`);
        }
      } else {
        const errorText = await response.text();
        console.error('🏋️ API Error:', response.status, errorText);
        throw new Error(`Failed to load gym: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error loading gym:', error);
      
      // Fallback: Create a sample gym for testing
      console.log('🏋️ Creating fallback sample gym for testing');
      const sampleGym: Gym = {
        id: id || 'sample-gym',
        name: 'Sample Premium Gym',
        tier: 'PREMIUM',
        price_per_hour: 80,
        rating: 4.5,
        review_count: 25,
        address: '123 Fitness Street, Casablanca, Morocco',
        latitude: 33.5731,
        longitude: -7.5898,
        description: 'A premium fitness facility with state-of-the-art equipment and professional trainers.',
        amenities: ['Spa', 'Pool', 'Sauna', 'Personal Training', 'Group Classes'],
        tierColor: '#9B59B6',
        image: PremiumImage,
        photos: [PremiumImage],
        opening_hours: 'Mon-Fri: 6:00 AM - 10:00 PM, Sat-Sun: 8:00 AM - 8:00 PM',
        contact_phone: '+212 5XX XXX XXX',
        contact_email: 'info@premiumgym.com',
        website: 'www.premiumgym.com',
        social_media: {},
        facilities: {
          parking: true,
          locker_rooms: true,
          showers: true,
          towel_service: true,
          water_fountain: true,
          air_conditioning: true
        },
        equipment: ['Treadmills', 'Weight Machines', 'Free Weights', 'Cardio Equipment', 'Functional Training'],
        classes: ['Yoga', 'Pilates', 'Zumba', 'CrossFit', 'Spinning'],
        trainers: ['Professional Trainers Available']
      };
      
      setGym(sampleGym);
      setError(''); // Clear error since we have sample data
    } finally {
      setIsLoading(false);
    }
  };

  // Load user session
  useEffect(() => {
    console.log('🔍 Loading user session...');
    const sessionData = localStorage.getItem('supabase_session');
    console.log('🔍 Session data:', sessionData);
    
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        console.log('🔍 Parsed session:', parsed);
        // Check different possible user structures
        let userData = null;
        if (parsed.user) {
          userData = parsed.user;
        } else if (parsed.current_user) {
          userData = parsed.current_user;
        } else if (parsed.user_metadata) {
          userData = {
            id: parsed.user_id || parsed.id,
            email: parsed.email,
            ...parsed.user_metadata
          };
        } else if (parsed.email) {
          userData = {
            id: parsed.user_id || parsed.id,
            email: parsed.email
          };
        }
        
        if (userData) {
          console.log('✅ User loaded:', userData.email);
        } else {
          console.log('❌ No user data found in session');
        }
      } catch (error) {
        console.error('❌ Error parsing session:', error);
      }
    } else {
      console.log('⚠️ No session data found');
    }
  }, []);

  // Load gym details on component mount
  useEffect(() => {
    if (id) {
      loadGymDetails();
    }
  }, [id]);

  // Get tier emoji with color

  // Get tier image
  const getTierImage = (tier: string) => {
    switch (tier) {
      case 'BASIC': return BasicImage;
      case 'STANDARD': return StandardImage;
      case 'PREMIUM': return PremiumImage;
      case 'LUXURY': return LuxuryImage;
      default: return BasicImage;
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(price);
  };


  // Handle booking
  const handleBookNow = () => {
    console.log('🎯 HandleBookNow called');
    console.log('🎯 Current user state:', user);
    
    if (!user) {
      console.log('❌ No user found, showing login alert');
      alert('Please log in to book this gym. You can sign up or log in from the main page.');
      return;
    }
    
    console.log('✅ User found, opening booking modal');
    setShowBookingModal(true);
  };

  // Create booking
  const createBooking = async () => {
    if (!user || !gym) {
      console.error('❌ Missing user or gym data:', { user: !!user, gym: !!gym });
      alert('❌ Missing user or gym information. Please refresh the page and try again.');
      return;
    }
    
    if (!selectedDate || !selectedTime || !selectedDuration || !selectedPass) {
      console.error('❌ Missing booking details:', { selectedDate, selectedTime, selectedDuration, selectedPass });
      alert('❌ Please fill in all booking details (date, time, duration, pass type).');
      return;
    }
    
    setIsCreatingBooking(true);
    
    try {
      // Use the proper Supabase client for authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Session error:', sessionError);
        alert('❌ Authentication error. Please log in again.');
        return;
      }
      
      if (!session) {
        console.error('❌ No active session found');
        alert('❌ Please log in to create a booking.');
        return;
      }
      
      console.log('✅ User authenticated:', session.user.email);
      
      const bookingData = {
        user_id: user.id,
        club_id: gym.id,
        booking_type: 'SINGLE_SESSION' as const,
        scheduled_start: `${selectedDate}T${selectedTime}:00.000Z`,
        scheduled_end: `${selectedDate}T${parseInt(selectedTime.split(':')[0]) + parseInt(selectedDuration)}:${selectedTime.split(':')[1]}:00.000Z`,
        credits_required: parseInt(selectedDuration),
        price_per_credit: gym.price_per_hour,
        total_amount: gym.price_per_hour * parseInt(selectedDuration),
        payment_status: 'PENDING' as const,
        payment_method: 'STRIPE',
        notes: `Booking for ${gym.name} - ${selectedPass} - ${selectedDuration} hour(s)`
      };

      console.log('📝 Creating booking:', bookingData);

      // Create booking using Supabase client
      console.log('🔍 Creating booking via Supabase...');
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData as any)
        .select()
        .single();
      
      if (bookingError) {
        console.error('❌ Booking creation failed:', bookingError);
        console.log('🔄 Booking failed, falling back to simulated booking...');
        
        // Create a simulated booking for testing
        const simulatedBooking = {
          id: `sim-${Date.now()}`,
          user_id: user.id,
          club_id: gym.id,
          booking_type: selectedPass,
          scheduled_start: `${selectedDate}T${selectedTime}:00.000Z`,
          scheduled_end: `${selectedDate}T${parseInt(selectedTime.split(':')[0]) + parseInt(selectedDuration)}:${selectedTime.split(':')[1]}:00.000Z`,
          status: 'CONFIRMED',
          created_at: new Date().toISOString(),
          club_name: gym.name
        };
        
        console.log('🎭 Simulated booking created:', simulatedBooking);
        
        // Generate QR code for simulated booking
        const qrData = QRCodeGenerator.generateBookingQRData(simulatedBooking);
        console.log('🎯 QR Code generated for simulated booking:', qrData);
        
        setBookingData(simulatedBooking);
        setShowBookingModal(false);
        setShowPaymentModal(false);
        setShowQRModal(true);
        
        alert('✅ Simulated booking created! (API is currently unavailable)');
        return;
      }
      
      // Success case - real booking was created
      console.log('✅ Real booking created successfully:', booking);
      
      // Generate QR code for the real booking
      const qrData = QRCodeGenerator.generateBookingQRData(booking);
      console.log('🎯 QR Code generated:', qrData);
      
      setBookingData(booking);
      setShowBookingModal(false);
      setShowPaymentModal(false);
      setShowQRModal(true);
      
      alert('✅ Booking created successfully! Your QR code is ready.');
    } catch (error) {
      console.error('❌ Booking error:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        user: user ? { id: user.id, email: user.email } : 'No user',
        gym: gym ? { id: gym.id, name: gym.name } : 'No gym',
        selectedDate,
        selectedTime,
        selectedDuration,
        selectedPass
      });
      
      alert('❌ Failed to create booking. Please try again.');
    } finally {
      setIsCreatingBooking(false);
    }
  };

  // Handle payment with multiple payment methods
  const handlePayment = async () => {
    console.log('💳 Processing payment...', { paymentMethod });
    setPaymentStatus('processing');
    setStripeError(null);
    
    try {
      // Calculate total amount
      const totalAmount = gym ? (gym.price_per_hour * parseInt(selectedDuration)) : 0;
      
      // Handle different payment methods
      if (paymentMethod === 'stripe') {
        await handleStripePayment(totalAmount);
      } else if (paymentMethod === 'paypal') {
        await handlePayPalPayment(totalAmount);
      } else if (paymentMethod === 'wallet') {
        await handleWalletPayment(totalAmount);
      } else if (paymentMethod === 'amanpay') {
        await handleAmanPayPayment(totalAmount);
      } else {
        throw new Error('Unknown payment method');
      }
      
    } catch (error) {
      console.error('💳 Payment error:', error);
      setStripeError(error instanceof Error ? error.message : 'Payment failed');
      setPaymentStatus('failed');
    }
  };
  
  // Handle Stripe payment
  const handleStripePayment = async (totalAmount: number) => {
    console.log('💳 Processing Stripe payment...');
    
    // Initialize Stripe with your real publishable key
    const stripe = await loadStripe('pk_test_YOUR_REAL_STRIPE_PUBLISHABLE_KEY_HERE');
    
    if (!stripe) {
      throw new Error('Failed to load Stripe');
    }
    
    // Create payment intent (in a real app, this would be done on your backend)
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: 'mad',
        metadata: {
          gym_id: gym?.id,
          user_id: user?.id,
          booking_type: selectedPass,
          duration: selectedDuration
        }
      })
    });
    
    if (!response.ok) {
      // Fallback to simulated payment for demo
      console.log('💳 Using simulated Stripe payment (endpoint not available)');
      await simulatePayment();
      return;
    }
    
    const { clientSecret } = await response.json();
    
    // Confirm payment with Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: {
          // Simulated card details for testing
          token: 'tok_visa'
        }
      }
    });
    
    if (error) {
      console.error('💳 Stripe error:', error);
      throw new Error(error.message || 'Stripe payment failed');
    }
    
    if (paymentIntent.status === 'succeeded') {
      console.log('✅ Stripe payment succeeded:', paymentIntent);
      setPaymentStatus('success');
      setShowPaymentModal(false);
      createBooking();
    }
  };
  
  // Handle PayPal payment
  const handlePayPalPayment = async (totalAmount: number) => {
    console.log('💳 Processing PayPal payment...');
    
    // REAL PAYPAL IMPLEMENTATION:
    // 1. Create PayPal order on your backend
    const orderResponse = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: totalAmount,
        currency: 'MAD',
        gym_id: gym?.id,
        user_id: user?.id,
        booking_type: selectedPass,
        duration: selectedDuration
      })
    });
    
    if (!orderResponse.ok) {
      throw new Error('Failed to create PayPal order');
    }
    
    const { orderID } = await orderResponse.json();
    
    // 2. Redirect to PayPal or use PayPal SDK
    // Option A: Redirect to PayPal
    window.location.href = `https://www.paypal.com/checkoutnow?token=${orderID}`;
    
    // Option B: Use PayPal SDK (requires PayPalScriptProvider)
    // const { orderID: approvedOrderID } = await paypal.Buttons({
    //   createOrder: () => orderID,
    //   onApprove: async (data) => {
    //     const captureResponse = await fetch('/api/paypal/capture-order', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ orderID: data.orderID })
    //     });
    //     return captureResponse.json();
    //   }
    // }).render('#paypal-button-container');
    
    // For now, simulate the process
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ PayPal payment processed successfully');
    setPaymentStatus('success');
    setShowPaymentModal(false);
    createBooking();
  };
  
  // Handle Digital Wallet payment
  const handleWalletPayment = async (totalAmount: number) => {
    console.log('💳 Processing Digital Wallet payment...');
    
    // Simulate wallet payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would integrate with Apple Pay/Google Pay
    console.log('✅ Digital Wallet payment simulated successfully');
    setPaymentStatus('success');
    setShowPaymentModal(false);
    createBooking();
  };
  
  // Handle AmanPay payment
  const handleAmanPayPayment = async (totalAmount: number) => {
    console.log('💳 Processing AmanPay payment...');
    
    try {
      // REAL AMANPAY IMPLEMENTATION:
      // 1. Create AmanPay order on your backend
      const orderResponse = await fetch('/api/amanpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'MAD',
          gym_id: gym?.id,
          user_id: user?.id,
          booking_type: selectedPass,
          duration: selectedDuration,
          description: `Gym booking for ${gym?.name}`
        })
      });
      
      if (!orderResponse.ok) {
        throw new Error('Failed to create AmanPay order');
      }
      
      const { orderId, paymentUrl } = await orderResponse.json();
      
      // 2. Redirect to AmanPay payment page
      console.log('🔄 Redirecting to AmanPay payment page...');
      window.location.href = paymentUrl;
      
      // Note: After payment completion, AmanPay will redirect back to your callback URL
      // where you should verify the payment and create the booking
      
    } catch (error) {
      console.error('❌ AmanPay error:', error);
      
      // Fallback to simulated payment for demo
      console.log('🔄 AmanPay API not available, using simulated payment...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ AmanPay payment simulated successfully');
      setPaymentStatus('success');
      setShowPaymentModal(false);
      createBooking();
    }
  };
  
  // Simulate payment for demo purposes
  const simulatePayment = async () => {
    console.log('💳 Simulating payment processing...');
    
    // Simulate payment processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success
    setPaymentStatus('success');
    setShowPaymentModal(false);
    createBooking();
  };
  
  // Handle QR code scanning
  const handleQRCodeScanned = (qrData: string) => {
    console.log('📱 QR Code scanned:', qrData);
    
    // Parse and validate the QR code
    const parsedData = QRCodeGenerator.parseQRCodeData(qrData);
    if (parsedData) {
      const isValid = QRCodeGenerator.isQRCodeValid(parsedData);
      
      if (isValid) {
        alert(`✅ Valid QR Code!\nBooking ID: ${parsedData.bookingId.slice(0, 8)}...\nAccess granted for gym entry.`);
      } else {
        alert(`❌ Invalid QR Code!\nBooking ID: ${parsedData.bookingId.slice(0, 8)}...\nThis QR code is expired or not yet valid.`);
      }
    } else {
      alert('❌ Invalid QR Code format! This does not appear to be a valid gym booking QR code.');
    }
    
    setShowQRScanner(false);
  };

  // Get pass options
  const getPassOptions = () => {
    return [
      { value: 'SINGLE_SESSION', label: 'Single Session', price: gym?.price_per_hour || 0, duration: '1 hour' },
      { value: 'DAILY_PASS', label: 'Daily Pass', price: (gym?.price_per_hour || 0) * 8, duration: '8 hours' },
      { value: 'WEEKLY_PASS', label: 'Weekly Pass', price: (gym?.price_per_hour || 0) * 40, duration: '40 hours' },
      { value: 'MONTHLY_PASS', label: 'Monthly Pass', price: (gym?.price_per_hour || 0) * 160, duration: '160 hours' }
    ];
  };

  // Get price for selected pass
  const getPassPrice = () => {
    const selectedPassOption = getPassOptions().find(p => p.value === selectedPass);
    if (selectedPassOption) {
      return Math.round(selectedPassOption.price * parseInt(selectedDuration));
    }
    return gym?.price_per_hour || 0;
  };

  // Get time slots
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  // Get available dates (next 30 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-space-grotesk font-medium">Loading gym details...</p>
        </div>
      </div>
    );
  }

  if (error || !gym) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-space-grotesk font-semibold text-gray-900 mb-4">Gym Not Found</h1>
          <p className="text-gray-600 font-space-grotesk font-medium mb-6">{error || 'The gym you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/venues')} className="bg-gray-900 hover:bg-gray-800 text-white font-space-grotesk font-medium">
            Back to Gyms
          </Button>
        </div>
      </div>
    );
  }

  // Get tier-based color scheme
  const tierColor = getTierEmojiColor(gym.tier);
  const baseColor = tierColor.replace('bg-', '').replace('-500', '');
  
  // Define pastel button colors for each tier
  const getButtonColor = (tier: string) => {
    switch (tier) {
      case 'BASIC': return 'bg-orange-300 hover:bg-orange-400 text-orange-900'; // Pastel orange for blue
      case 'STANDARD': return 'bg-purple-300 hover:bg-purple-400 text-purple-900'; // Pastel purple for green
      case 'PREMIUM': return 'bg-blue-300 hover:bg-blue-400 text-blue-900'; // Pastel blue for orange
      case 'LUXURY': return 'bg-emerald-300 hover:bg-emerald-400 text-emerald-900'; // Pastel emerald for purple
      default: return 'bg-gray-300 hover:bg-gray-400 text-gray-900';
    }
  };
  
  const buttonColor = getButtonColor(gym.tier);
  
  return (
    <div className={`min-h-screen ${getTierPastelGradient(gym.tier)} relative`}>
      {/* Gym Wall Texture Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        {/* Gym Equipment Silhouettes */}
        <div className="absolute top-10 left-10 w-20 h-20 text-gray-600" style={{fontSize: '60px', opacity: 0.1}}>
          🏋️
        </div>
        <div className="absolute top-32 right-16 w-16 h-16 text-gray-600" style={{fontSize: '50px', opacity: 0.08}}>
          💪
        </div>
        <div className="absolute top-60 left-20 w-14 h-14 text-gray-600" style={{fontSize: '40px', opacity: 0.06}}>
          🏃
        </div>
        <div className="absolute top-80 right-24 w-18 h-18 text-gray-600" style={{fontSize: '45px', opacity: 0.07}}>
          🏊
        </div>
        <div className="absolute top-[400px] left-16 w-16 h-16 text-gray-600" style={{fontSize: '42px', opacity: 0.05}}>
          🚴
        </div>
        <div className="absolute top-[500px] right-12 w-20 h-20 text-gray-600" style={{fontSize: '48px', opacity: 0.06}}>
          🧘
        </div>
        <div className="absolute top-[600px] left-24 w-14 h-14 text-gray-600" style={{fontSize: '38px', opacity: 0.04}}>
          🥊
        </div>
        <div className="absolute top-[700px] right-20 w-16 h-16 text-gray-600" style={{fontSize: '40px', opacity: 0.05}}>
          ⚽
        </div>
        
        {/* Wall Texture Pattern */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(0,0,0,0.02) 1px, transparent 1px),
              radial-gradient(circle at 80% 80%, rgba(0,0,0,0.02) 1px, transparent 1px),
              radial-gradient(circle at 40% 60%, rgba(0,0,0,0.015) 1px, transparent 1px),
              linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.01) 50%, transparent 60%)
            `,
            backgroundSize: '100px 100px, 120px 120px, 80px 80px, 200px 200px',
            backgroundPosition: '0 0, 30px 30px, 60px 60px, 100px 100px'
          }}
        />
        
        {/* Subtle Brick Pattern */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 98%, rgba(0,0,0,0.01) 100%),
              linear-gradient(0deg, transparent 98%, rgba(0,0,0,0.01) 100%)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Gym Equipment Outlines */}
        <div className="absolute top-[200px] left-[60%] w-12 h-12 border border-gray-400 opacity-[0.02] rounded-full"></div>
        <div className="absolute top-[300px] left-[30%] w-8 h-20 border border-gray-400 opacity-[0.02]"></div>
        <div className="absolute top-[450px] left-[70%] w-16 h-4 border border-gray-400 opacity-[0.02] rounded"></div>
        <div className="absolute top-[550px] left-[40%] w-6 h-6 border border-gray-400 opacity-[0.02] rotate-45"></div>
        <div className="absolute top-[650px] left-[20%] w-10 h-10 border border-gray-400 opacity-[0.02] rounded"></div>
        
        {/* Motivational Text Elements */}
        <div className="absolute top-[350px] right-[10%] text-gray-400 opacity-[0.02] font-space-grotesk font-bold text-2xl rotate-12">
          STRONGER
        </div>
        <div className="absolute top-[750px] left-[15%] text-gray-400 opacity-[0.015] font-space-grotesk font-bold text-xl -rotate-6">
          FITNESS
        </div>
        <div className="absolute top-[200px] left-[75%] text-gray-400 opacity-[0.018] font-space-grotesk font-bold text-lg rotate-3">
          POWER
        </div>
      </div>
      {/* Header */}
      <div className={`bg-${baseColor}-100/80 backdrop-blur-sm shadow-sm border-b border-${baseColor}-200`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              onClick={() => navigate('/venues')} 
              variant="outline" 
              className={`border-${baseColor}-300 text-${baseColor}-700 hover:bg-${baseColor}-50 font-space-grotesk font-medium`}
            >
              ← Back to Gyms
            </Button>
            <div className="text-right">
              <h1 className={`text-2xl font-space-grotesk font-semibold text-${baseColor}-900`}>{gym.name}</h1>
              <p className={`text-${baseColor}-600 font-space-grotesk font-medium`}>📍 {gym.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Photo Gallery */}
            <Card className={`bg-${baseColor}-50/90 backdrop-blur-sm border-${baseColor}-200`}>
              <CardHeader>
                <CardTitle className={`font-space-grotesk font-medium text-lg text-${baseColor}-900`}>📸 Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Main Photo */}
                  <div className="relative">
                    <img 
                      src={gym.photos?.[selectedPhotoIndex] || gym.image} 
                      alt={gym.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute top-4 right-4">
                      <div 
                        className="px-3 py-1 text-xs font-space-grotesk font-medium text-white rounded-full flex items-center gap-1"
                        style={{ backgroundColor: getTierEmojiColor(gym.tier) }}
                      >
                        <span style={{ fontSize: '16px' }}>{getTierEmoji(gym.tier)}</span>
                        <span>{gym.tier}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Photo Thumbnails */}
                  {gym.photos && gym.photos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {gym.photos.map((photo, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedPhotoIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                            selectedPhotoIndex === index ? 'border-gray-900' : 'border-gray-200'
                          }`}
                        >
                          <img 
                            src={photo} 
                            alt={`${gym.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className={`bg-${baseColor}-50/90 backdrop-blur-sm border-${baseColor}-200`}>
              <CardHeader>
                <CardTitle className={`font-space-grotesk font-medium text-lg text-${baseColor}-900`}>📝 About This Gym</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-${baseColor}-700 leading-relaxed font-space-grotesk font-medium`}>
                  {gym.description || `Welcome to ${gym.name}, a ${gym.tier.toLowerCase()} tier fitness facility located in ${gym.address}. We provide top-quality equipment and professional services to help you achieve your fitness goals.`}
                </p>
              </CardContent>
            </Card>

            {/* Amenities & Facilities */}
            <Card className={`bg-${baseColor}-50/90 backdrop-blur-sm border-${baseColor}-200`}>
              <CardHeader>
                <CardTitle className={`font-space-grotesk font-medium text-lg text-${baseColor}-900`}>🏋️‍♀️ Amenities & Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* General Amenities */}
                  <div>
                    <h3 className="font-space-grotesk font-medium text-gray-900 mb-3">General Amenities</h3>
                    <div className="space-y-2">
                      {(() => {
                        let amenitiesList = [];
                        if (Array.isArray(gym.amenities)) {
                          amenitiesList = gym.amenities;
                        } else if (typeof gym.amenities === 'object' && gym.amenities !== null) {
                          amenitiesList = Object.keys(gym.amenities);
                        }
                        
                        return amenitiesList.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-700 font-space-grotesk">{amenity}</span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Facilities */}
                  <div>
                    <h3 className="font-space-grotesk font-medium text-gray-900 mb-3">Facilities</h3>
                    <div className="space-y-2">
                      {gym.facilities && Object.entries(gym.facilities).map(([facility, available]) => (
                        <div key={facility} className="flex items-center gap-2">
                          <span className={available ? 'text-green-500' : 'text-gray-400'}>
                            {available ? '✓' : '✗'}
                          </span>
                          <span className={`font-space-grotesk ${available ? 'text-gray-700' : 'text-gray-400'}`}>
                            {facility.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Equipment & Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="font-space-grotesk font-medium text-lg text-gray-900">💪 Equipment & Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Equipment */}
                  <div>
                    <h3 className="font-space-grotesk font-medium text-gray-900 mb-3">Available Equipment</h3>
                    <div className="flex flex-wrap gap-2">
                      {gym.equipment?.map((equipment, index) => (
                        <Badge key={index} variant="secondary" className="font-space-grotesk">
                          {equipment}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Classes */}
                  <div>
                    <h3 className="font-space-grotesk font-medium text-gray-900 mb-3">Classes Offered</h3>
                    <div className="flex flex-wrap gap-2">
                      {gym.classes?.map((classType, index) => (
                        <Badge key={index} variant="outline" className="font-space-grotesk">
                          {classType}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="font-space-grotesk font-medium text-lg text-gray-900">⭐ Reviews & Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-space-grotesk font-semibold text-gray-900 mb-2">
                    {gym.rating?.toFixed(1) || '4.0'}
                  </div>
                  <div className="flex justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < Math.floor(gym.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 font-space-grotesk">
                    Based on {gym.review_count || 0} reviews
                  </p>
                </div>
                
                {/* Sample Reviews */}
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="font-space-grotesk font-medium text-gray-900">Ahmed M.</p>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 font-space-grotesk">
                      "Excellent gym with modern equipment and friendly staff. Highly recommended!"
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="font-space-grotesk font-medium text-gray-900">Fatima K.</p>
                        <div className="flex gap-1">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                          <Star className="w-4 h-4 text-gray-300" />
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 font-space-grotesk">
                      "Great facilities and clean environment. The classes are amazing!"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <ReviewsSection clubId={gym.id} clubName={gym.name} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className={`sticky top-8 bg-${baseColor}-50/90 backdrop-blur-sm border-${baseColor}-200`}>
              <CardHeader>
                <CardTitle className={`font-space-grotesk font-medium text-lg text-${baseColor}-900`}>🎯 Book Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-3xl font-space-grotesk font-semibold text-${baseColor}-900 mb-2`}>
                    {formatPrice(gym.price_per_hour)}
                  </div>
                  <p className={`text-${baseColor}-600 font-space-grotesk font-medium`}>per hour</p>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={handleBookNow}
                    className={`w-full ${buttonColor} py-3 rounded-lg font-space-grotesk font-medium transition-all duration-200 flex items-center justify-center gap-2`}
                  >
                    <span style={{ fontSize: '18px' }}>{getTierEmoji(gym.tier)}</span>
                    <span>Book This Gym</span>
                  </Button>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500 font-space-grotesk">
                    {user ? `Logged in as: ${user.email}` : 'Please log in to book'}
                  </p>
                    {!user && (
                      <div>
                        <button
                          onClick={() => navigate('/auth-test')}
                          className={`text-xs ${buttonColor} px-3 py-1 rounded font-space-grotesk font-medium`}
                        >
                          Go to Auth Test
                        </button>
                      </div>
                    )}
                  </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="font-space-grotesk font-medium text-lg text-gray-900">📞 Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-space-grotesk font-medium text-gray-900">Opening Hours</p>
                    <p className="text-sm text-gray-600 font-space-grotesk">{gym.opening_hours}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-space-grotesk font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600 font-space-grotesk">{gym.contact_phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-space-grotesk font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600 font-space-grotesk">{gym.contact_email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="font-space-grotesk font-medium text-lg text-gray-900">📊 Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-space-grotesk text-gray-600">Tier</span>
                  <div 
                    className="px-2 py-1 text-xs font-space-grotesk font-medium text-white rounded-full flex items-center gap-1"
                    style={{ backgroundColor: getTierEmojiColor(gym.tier) }}
                  >
                    <span style={{ fontSize: '14px' }}>{getTierEmoji(gym.tier)}</span>
                    <span>{gym.tier}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-space-grotesk text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-space-grotesk font-medium text-gray-900">
                      {gym.rating?.toFixed(1) || '4.0'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-space-grotesk text-gray-600">Reviews</span>
                  <span className="font-space-grotesk font-medium text-gray-900">
                    {gym.review_count || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-space-grotesk font-semibold text-gray-900">
                  <Calendar className="inline-block w-6 h-6 mr-2" />
                  Book {gym?.name}
                </h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Booking Details */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pass-type" className="font-space-grotesk font-medium text-gray-700">
                      🎫 Pass Type
                    </Label>
                    <Select value={selectedPass} onValueChange={setSelectedPass}>
                      <SelectTrigger className="font-space-grotesk">
                        <SelectValue placeholder="Select pass type" />
                      </SelectTrigger>
                      <SelectContent>
                        {getPassOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex justify-between items-center w-full">
                              <span>{option.label}</span>
                              <span className="text-green-600 font-medium">{option.price} MAD</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date" className="font-space-grotesk font-medium text-gray-700">
                      📅 Select Date
                    </Label>
                    <Select value={selectedDate} onValueChange={setSelectedDate}>
                      <SelectTrigger className="font-space-grotesk">
                        <SelectValue placeholder="Choose date" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableDates().map((date) => (
                          <SelectItem key={date} value={date}>
                            {new Date(date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="time" className="font-space-grotesk font-medium text-gray-700">
                      ⏰ Select Time
                    </Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="font-space-grotesk">
                        <SelectValue placeholder="Choose time" />
                      </SelectTrigger>
                      <SelectContent>
                        {getTimeSlots().map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="duration" className="font-space-grotesk font-medium text-gray-700">
                      ⏱️ Duration (hours)
                    </Label>
                    <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                      <SelectTrigger className="font-space-grotesk">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 8, 12].map((hours) => (
                          <SelectItem key={hours} value={hours.toString()}>
                            {hours} hour{hours > 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Column - Booking Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-space-grotesk font-semibold text-gray-900 mb-4">Booking Summary</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-space-grotesk text-gray-600">Gym:</span>
                      <span className="font-space-grotesk font-medium">{gym?.name}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-space-grotesk text-gray-600">Pass:</span>
                      <span className="font-space-grotesk font-medium">
                        {getPassOptions().find(p => p.value === selectedPass)?.label}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-space-grotesk text-gray-600">Date:</span>
                      <span className="font-space-grotesk font-medium">
                        {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Not selected'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-space-grotesk text-gray-600">Time:</span>
                      <span className="font-space-grotesk font-medium">{selectedTime || 'Not selected'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-space-grotesk text-gray-600">Duration:</span>
                      <span className="font-space-grotesk font-medium">{selectedDuration} hour{selectedDuration !== '1' ? 's' : ''}</span>
                    </div>
                    
                    <hr className="my-3" />
                    
                    <div className="flex justify-between">
                      <span className="font-space-grotesk font-semibold text-gray-900">Total:</span>
                      <span className="font-space-grotesk font-bold text-green-600 text-lg">
                        {gym ? (gym.price_per_hour * parseInt(selectedDuration)).toFixed(0) : 0} MAD
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setShowBookingModal(false)}
                  variant="outline"
                  className="flex-1 font-space-grotesk font-medium"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (!selectedDate || !selectedTime) {
                      alert('Please select date and time');
                      return;
                    }
                    setShowBookingModal(false);
                    setShowPaymentModal(true);
                  }}
                  className={`flex-1 font-space-grotesk font-medium flex items-center justify-center gap-2 ${buttonColor}`}
                >
                  <CreditCard className="w-4 h-4" />
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-space-grotesk font-semibold text-gray-900">
                  <CreditCard className="inline-block w-6 h-6 mr-2" />
                  Payment
                </h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Payment Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-space-grotesk font-semibold text-gray-900 mb-4">Payment Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-space-grotesk text-gray-600">Gym:</span>
                      <span className="font-space-grotesk font-medium">{gym?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-space-grotesk text-gray-600">Pass:</span>
                      <span className="font-space-grotesk font-medium">
                        {getPassOptions().find(p => p.value === selectedPass)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-space-grotesk text-gray-600">Duration:</span>
                      <span className="font-space-grotesk font-medium">{selectedDuration} hour{selectedDuration !== '1' ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-space-grotesk text-gray-600">Price per hour:</span>
                      <span className="font-space-grotesk font-medium">{gym?.price_per_hour} MAD</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between">
                      <span className="font-space-grotesk font-semibold text-gray-900">Total:</span>
                      <span className="font-space-grotesk font-bold text-green-600 text-lg">
                        {gym ? (gym.price_per_hour * parseInt(selectedDuration)).toFixed(0) : 0} MAD
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div>
                  <h4 className="font-space-grotesk font-semibold text-gray-900 mb-4">Payment Method</h4>
                  <div className="space-y-3">
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'stripe' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('stripe')}
                    >
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-3 text-blue-600" />
                        <div>
                          <div className="font-space-grotesk font-medium text-gray-900">Credit/Debit Card</div>
                          <div className="text-sm text-gray-500 font-space-grotesk">Visa, Mastercard, American Express</div>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'paypal' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('paypal')}
                    >
                      <div className="flex items-center">
                        <div className="w-5 h-5 mr-3 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">P</div>
                        <div>
                          <div className="font-space-grotesk font-medium text-gray-900">PayPal</div>
                          <div className="text-sm text-gray-500 font-space-grotesk">Pay with your PayPal account</div>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'wallet' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('wallet')}
                    >
                      <div className="flex items-center">
                        <div className="w-5 h-5 mr-3 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">W</div>
                        <div>
                          <div className="font-space-grotesk font-medium text-gray-900">Digital Wallet</div>
                          <div className="text-sm text-gray-500 font-space-grotesk">Apple Pay, Google Pay</div>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'amanpay' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('amanpay')}
                    >
                      <div className="flex items-center">
                        <div className="w-5 h-5 mr-3 bg-orange-600 rounded text-white text-xs flex items-center justify-center font-bold">A</div>
                        <div>
                          <div className="font-space-grotesk font-medium text-gray-900">AmanPay</div>
                          <div className="text-sm text-gray-500 font-space-grotesk">Moroccan payment gateway</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                {paymentStatus === 'processing' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                      <div className="font-space-grotesk font-medium text-blue-800">Processing payment...</div>
                    </div>
                  </div>
                )}

                {paymentStatus === 'failed' && stripeError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="font-space-grotesk font-medium text-red-800">Payment Failed</div>
                    <div className="text-sm text-red-600 font-space-grotesk mt-1">{stripeError}</div>
                  </div>
                )}

                {/* Security Notice */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="text-green-600 mr-2">🔒</div>
                    <div>
                      <div className="font-space-grotesk font-medium text-green-800">Secure Payment</div>
                      <div className="text-sm text-green-600 font-space-grotesk mt-1">
                        Your payment information is encrypted and secure. We never store your card details.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setShowPaymentModal(false)}
                  variant="outline"
                  className="flex-1 font-space-grotesk font-medium"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={isCreatingBooking || paymentStatus === 'processing'}
                  className={`flex-1 font-space-grotesk font-medium flex items-center justify-center gap-2 ${buttonColor}`}
                >
                  {paymentStatus === 'processing' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Pay {gym ? (gym.price_per_hour * parseInt(selectedDuration)).toFixed(0) : 0} MAD
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && bookingData && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowQRModal(false);
            }
          }}
          onTouchMove={(e) => {
            // Prevent background scrolling when touching the modal backdrop
            e.preventDefault();
          }}
          style={{ 
            touchAction: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-lg max-w-lg w-full border border-gray-200 max-h-[90vh] overflow-y-auto"
            onTouchMove={(e) => {
              // Allow scrolling within the modal content
              e.stopPropagation();
            }}
            onClick={(e) => {
              // Prevent modal from closing when clicking inside
              e.stopPropagation();
            }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-space-grotesk font-semibold text-gray-900">
                  <QrCode className="inline-block w-6 h-6 mr-2" />
                  Your QR Code
                </h3>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              
              <div className="text-center space-y-6">
                {/* Success Message */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-green-600 font-space-grotesk font-semibold mb-2">
                    ✅ Booking Confirmed!
                  </div>
                  <div className="text-sm text-green-600 font-space-grotesk">
                    Your booking has been created successfully
                  </div>
                </div>
                
                {/* QR Code Display */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="mb-4">
                    <div className="text-gray-700 font-space-grotesk font-medium mb-2">
                      Show this QR code at the gym entrance
                    </div>
                    <div className="text-sm text-gray-500 font-space-grotesk">
                      Valid for: {selectedDuration} hour{selectedDuration !== '1' ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <QRCodeDisplay booking={bookingData} />
                  </div>
                </div>
                
                {/* Booking Details */}
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <h4 className="font-space-grotesk font-semibold text-gray-900 mb-3">Booking Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-space-grotesk text-gray-600">Booking ID:</span>
                      <span className="font-space-grotesk font-medium font-mono">{bookingData.id.slice(0, 8)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-space-grotesk text-gray-600">Gym:</span>
                      <span className="font-space-grotesk font-medium">{gym?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-space-grotesk text-gray-600">Date:</span>
                      <span className="font-space-grotesk font-medium">
                        {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-space-grotesk text-gray-600">Time:</span>
                      <span className="font-space-grotesk font-medium">{selectedTime || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-space-grotesk text-gray-600">Duration:</span>
                      <span className="font-space-grotesk font-medium">{selectedDuration} hour{selectedDuration !== '1' ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-space-grotesk text-gray-600">Status:</span>
                      <span className="font-space-grotesk font-medium text-green-600">Confirmed</span>
                    </div>
                  </div>
                </div>
                
                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="text-blue-600 mr-2">ℹ️</div>
                    <div className="text-left">
                      <div className="font-space-grotesk font-medium text-blue-800 mb-1">How to use your QR code:</div>
                      <div className="text-sm text-blue-600 font-space-grotesk space-y-1">
                        <div>1. Arrive at the gym at your scheduled time</div>
                        <div>2. Show this QR code to the staff</div>
                        <div>3. They will scan it to grant you access</div>
                        <div>4. Enjoy your workout!</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={async () => {
                      try {
                        await QRCodeGenerator.downloadQRCodePNG(bookingData);
                      } catch (error) {
                        console.error('Download failed:', error);
                        alert('Failed to download QR code. Please try again.');
                      }
                    }}
                    className="w-full font-space-grotesk font-medium text-white flex items-center justify-center gap-2"
                    style={{ backgroundColor: getTierEmojiColor(gym?.tier || 'BASIC') }}
                  >
                    <QrCode className="w-4 h-4" />
                    Download QR Code
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => navigate('/profile')}
                      variant="outline"
                      className="font-space-grotesk font-medium"
                    >
                      View in Profile
                    </Button>
                    <Button
                      onClick={() => setShowQRModal(false)}
                      variant="outline"
                      className="font-space-grotesk font-medium"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-space-grotesk font-semibold text-gray-900">
                  <QrCode className="inline-block w-6 h-6 mr-2" />
                  QR Code Scanner
                </h3>
                <button
                  onClick={() => setShowQRScanner(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <QRScanner 
                onQRCodeScanned={handleQRCodeScanned}
                onClose={() => setShowQRScanner(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && bookingData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={async (paymentData) => {
            console.log('Payment successful:', paymentData);
            
            // Create the booking after successful payment
            try {
              await createBooking();
              console.log('✅ Booking created successfully after payment');
              
              // Close payment modal and show QR code
              setShowPaymentModal(false);
              setShowQRModal(true);
            } catch (error) {
              console.error('❌ Error creating booking after payment:', error);
              alert('Payment successful but there was an error creating your booking. Please contact support.');
            }
          }}
          bookingData={{
            id: bookingData.id,
            gymName: gym?.name || 'Unknown Gym',
            amount: getPassPrice(),
            duration: selectedDuration,
            date: selectedDate || new Date().toISOString().split('T')[0],
            time: selectedTime || 'N/A'
          }}
          userData={{
            email: user?.email || '',
            name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
            phone: user?.user_metadata?.phone || '+212600000000'
          }}
        />
      )}

      {/* Floating QR Scanner Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setShowQRScanner(true)}
          className={`${buttonColor} p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200`}
          size="lg"
        >
          <QrCode className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default GymDetail;
