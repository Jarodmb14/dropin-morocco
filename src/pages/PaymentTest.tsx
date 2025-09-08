import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const PaymentTest: React.FC = () => {
  const [amount, setAmount] = useState('50');
  const [currency, setCurrency] = useState('mad');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [error, setError] = useState<string>('');

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');
    setPaymentStatus('pending');

    try {
      // Initialize Stripe
      const stripe = await loadStripe('pk_test_your_stripe_publishable_key_here');
      
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success
      setPaymentStatus('success');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setPaymentStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-space-grotesk font-semibold text-gray-900">
              <CreditCard className="w-6 h-6" />
              Payment System Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="font-space-grotesk font-medium">Amount</Label>
              <div className="flex gap-2">
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="font-space-grotesk"
                />
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-24 font-space-grotesk">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mad">MAD</SelectItem>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label className="font-space-grotesk font-medium">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="font-space-grotesk">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Credit/Debit Card (Stripe)</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="wallet">Digital Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Status */}
            {paymentStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-space-grotesk font-medium">Payment Successful!</span>
                </div>
                <p className="text-sm text-green-600 font-space-grotesk mt-1">
                  Your payment of {amount} {currency.toUpperCase()} has been processed successfully.
                </p>
              </div>
            )}

            {paymentStatus === 'failed' && error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <XCircle className="w-5 h-5" />
                  <span className="font-space-grotesk font-medium">Payment Failed</span>
                </div>
                <p className="text-sm text-red-600 font-space-grotesk mt-1">{error}</p>
              </div>
            )}

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={isProcessing || !amount}
              className="w-full font-space-grotesk font-medium text-white bg-gray-900 hover:bg-gray-800"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay {amount} {currency.toUpperCase()}
                </>
              )}
            </Button>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-space-grotesk font-medium text-blue-800 mb-2">Test Instructions:</h4>
              <ul className="text-sm text-blue-600 font-space-grotesk space-y-1">
                <li>• This is a simulated payment system for testing</li>
                <li>• In production, this would integrate with real Stripe</li>
                <li>• The payment will always succeed after 2 seconds</li>
                <li>• Try different amounts and payment methods</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentTest;
