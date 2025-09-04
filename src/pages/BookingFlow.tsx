import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Clock, CreditCard, QrCode, MapPin, Calendar, Users } from 'lucide-react';
import { BusinessRules } from '@/lib/api/business-rules';
import { supabase } from '@/integrations/supabase/client';

interface Venue {
  id: string;
  name: string;
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ULTRA_LUXE';
  city: string;
  address?: string;
  monthly_price?: number;
}

interface ProductOption {
  id: string;
  type: 'SINGLE' | 'PACK5' | 'PACK10' | 'PASS_STANDARD' | 'PASS_PREMIUM';
  name: string;
  description: string;
  basePrice: number;
  credits: number;
  validity: string;
  icon: string;
  popular?: boolean;
}

const BookingFlow = () => {
  const { venueId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  const initialType = searchParams.get('type') || 'single';

  useEffect(() => {
    fetchVenue();
  }, [venueId]);

  const fetchVenue = async () => {
    try {
      if (!venueId) return;

      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', venueId)
        .single();

      if (error) throw error;
      setVenue(data);
    } catch (error) {
      console.error('Error fetching venue:', error);
      // Load sample venue for demo
      loadSampleVenue();
    } finally {
      setLoading(false);
    }
  };

  const loadSampleVenue = () => {
    const sampleVenues: Record<string, Venue> = {
      '1': {
        id: '1',
        name: 'FitZone Casablanca',
        tier: 'PREMIUM',
        city: 'Casablanca',
        address: 'Boulevard Mohammed V, Casablanca',
        monthly_price: 600,
      },
      '2': {
        id: '2',
        name: 'Basic Gym Rabat',
        tier: 'BASIC',
        city: 'Rabat',
        address: 'Avenue Hassan II, Rabat',
        monthly_price: 300,
      },
      '3': {
        id: '3',
        name: 'Luxury Spa Marrakech',
        tier: 'ULTRA_LUXE',
        city: 'Marrakech',
        address: 'Hivernage, Marrakech',
        monthly_price: 1200,
      },
    };
    
    setVenue(sampleVenues[venueId || '1'] || sampleVenues['1']);
  };

  const getProductOptions = (): ProductOption[] => {
    if (!venue) return [];

    const blanePricing = BusinessRules.calculateBlanePricing(venue.tier, venue.monthly_price);

    return [
      {
        id: 'single',
        type: 'SINGLE',
        name: 'Blane (Single Entry)',
        description: 'Perfect for trying out the venue',
        basePrice: blanePricing,
        credits: 1,
        validity: '1 day',
        icon: '🏋️',
        popular: true,
      },
      {
        id: 'pack5',
        type: 'PACK5',
        name: 'Blane Pack (5 Entries)',
        description: 'Save 10% with 5 entries',
        basePrice: Math.round(blanePricing * 5 * 0.9),
        credits: 5,
        validity: '90 days',
        icon: '🎯',
      },
      {
        id: 'pack10',
        type: 'PACK10',
        name: 'Blane Pack (10 Entries)',
        description: 'Save 20% with 10 entries',
        basePrice: Math.round(blanePricing * 10 * 0.8),
        credits: 10,
        validity: '90 days',
        icon: '💪',
      },
      {
        id: 'pass_standard',
        type: 'PASS_STANDARD',
        name: 'Blane Pass Standard',
        description: 'Unlimited access for 30 days',
        basePrice: 1200,
        credits: 999,
        validity: '30 days',
        icon: '⭐',
      },
      {
        id: 'pass_premium',
        type: 'PASS_PREMIUM',
        name: 'Blane Pass Premium',
        description: 'Unlimited multi-club access',
        basePrice: 2000,
        credits: 999,
        validity: '30 days',
        icon: '👑',
      },
    ];
  };

  const getCommissionBreakdown = (amount: number) => {
    const commission = BusinessRules.calculateCommission(amount);
    return {
      grossAmount: amount,
      commission,
      partnerAmount: amount - commission,
    };
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
  };

  const proceedToPayment = () => {
    if (!selectedProduct) return;
    setCurrentStep(2);
  };

  const processPayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const product = getProductOptions().find(p => p.id === selectedProduct);
      if (product && venue) {
        const validity = BusinessRules.getProductValidityPeriod(product.type);
        
        setBookingResult({
          bookingId: `BK${Date.now()}`,
          venue: venue.name,
          product: product.name,
          amount: product.basePrice,
          validFrom: new Date().toISOString(),
          validTo: validity.validTo,
          qrCode: `QR${Date.now()}${venue.id}`,
        });
        setCurrentStep(3);
      }
      setProcessing(false);
    }, 2000);
  };

  const generateQRCodeDisplay = (qrCode: string) => {
    // This would be replaced with an actual QR code library
    return (
      <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300 text-center">
        <QrCode className="w-24 h-24 mx-auto mb-4 text-gray-400" />
        <div className="font-mono text-sm text-gray-600 break-all">
          {qrCode}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Show this QR code at the venue entrance
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertDescription>Venue not found. Please try again.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const products = getProductOptions();
  const selectedProductData = products.find(p => p.id === selectedProduct);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Book Your Experience</h1>
              <p className="text-gray-600">{venue.name} • {venue.city}</p>
            </div>
            <Button 
              onClick={() => navigate('/venues')}
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              ← Back to Venues
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {/* Step 1 */}
            <div className={`flex items-center ${currentStep >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <span className="ml-2 font-medium">Pick</span>
            </div>

            <div className="w-12 h-px bg-gray-300"></div>

            {/* Step 2 */}
            <div className={`flex items-center ${currentStep >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {currentStep > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className="ml-2 font-medium">Pay</span>
            </div>

            <div className="w-12 h-px bg-gray-300"></div>

            {/* Step 3 */}
            <div className={`flex items-center ${currentStep >= 3 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">QR Code</span>
            </div>
          </div>
        </div>

        {/* Step 1: Product Selection */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  Choose Your Experience
                </CardTitle>
                <p className="text-gray-600">
                  Select the perfect package for your fitness journey at {venue.name}
                </p>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedProduct} onValueChange={handleProductSelect}>
                  <div className="grid gap-4 md:grid-cols-2">
                    {products.map((product) => (
                      <div key={product.id} className="relative">
                        <Label
                          htmlFor={product.id}
                          className={`block cursor-pointer rounded-lg border-2 p-6 transition-all ${
                            selectedProduct === product.id
                              ? 'border-orange-600 bg-orange-50'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <RadioGroupItem
                            value={product.id}
                            id={product.id}
                            className="sr-only"
                          />
                          
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{product.icon}</span>
                              <div>
                                <h3 className="font-semibold text-lg">{product.name}</h3>
                                <p className="text-sm text-gray-600">{product.description}</p>
                              </div>
                            </div>
                            {product.popular && (
                              <Badge className="bg-orange-600 text-white">Popular</Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">Price</div>
                              <div className="font-semibold text-orange-600">{product.basePrice} DHS</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Entries</div>
                              <div className="font-semibold">{product.credits === 999 ? 'Unlimited' : product.credits}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Valid for</div>
                              <div className="font-semibold">{product.validity}</div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                {selectedProduct && selectedProductData && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Commission Breakdown</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Total Amount</div>
                        <div className="font-semibold">{selectedProductData.basePrice} DHS</div>
                      </div>
                      <div>
                        <div className="text-gray-500">DROP-in Commission (25%)</div>
                        <div className="font-semibold text-orange-600">
                          {getCommissionBreakdown(selectedProductData.basePrice).commission} DHS
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Partner Revenue (75%)</div>
                        <div className="font-semibold text-green-600">
                          {getCommissionBreakdown(selectedProductData.basePrice).partnerAmount} DHS
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={proceedToPayment}
                    disabled={!selectedProduct}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  >
                    Continue to Payment →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Payment */}
        {currentStep === 2 && selectedProductData && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium mb-3">Order Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Venue:</span>
                      <span className="font-medium">{venue.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Product:</span>
                      <span className="font-medium">{selectedProductData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Credits:</span>
                      <span className="font-medium">
                        {selectedProductData.credits === 999 ? 'Unlimited' : selectedProductData.credits}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Validity:</span>
                      <span className="font-medium">{selectedProductData.validity}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-orange-600">{selectedProductData.basePrice} DHS</span>
                    </div>
                  </div>
                </div>

                {/* Payment Form Placeholder */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                  <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Payment Integration</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Stripe payment form would be integrated here
                  </p>
                  <p className="text-xs text-gray-400">
                    For demo purposes, click "Complete Payment" below
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    ← Back
                  </Button>
                  <Button
                    onClick={processPayment}
                    disabled={processing}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      'Complete Payment'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: QR Code */}
        {currentStep === 3 && bookingResult && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  Booking Confirmed!
                </CardTitle>
                <p className="text-gray-600">Your QR code is ready for use</p>
              </CardHeader>
              <CardContent>
                {/* Booking Details */}
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium mb-3">Booking Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Booking ID:</span>
                      <span className="font-mono">{bookingResult.bookingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Venue:</span>
                      <span className="font-medium">{bookingResult.venue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Product:</span>
                      <span className="font-medium">{bookingResult.product}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount Paid:</span>
                      <span className="font-medium text-green-600">{bookingResult.amount} DHS</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valid Until:</span>
                      <span className="font-medium">
                        {new Date(bookingResult.validTo).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-center">Your Access QR Code</h4>
                  {generateQRCodeDisplay(bookingResult.qrCode)}
                </div>

                {/* Instructions */}
                <Alert className="mb-6">
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> Show this QR code at the venue entrance. 
                    The code will expire on {new Date(bookingResult.validTo).toLocaleDateString()}.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4">
                  <Button
                    onClick={() => navigate('/venues')}
                    variant="outline"
                    className="flex-1"
                  >
                    Book Another Venue
                  </Button>
                  <Button
                    onClick={() => navigate('/bookings')}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  >
                    View All Bookings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
