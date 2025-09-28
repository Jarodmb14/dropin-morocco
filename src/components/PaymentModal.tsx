import React, { useState } from 'react';
import { X, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import FlutterwavePayment from './FlutterwavePayment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentData: any) => void;
  bookingData: {
    id: string;
    gymName: string;
    amount: number;
    duration: string;
    date: string;
    time: string;
  };
  userData: {
    email: string;
    name: string;
    phone: string;
  };
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  bookingData,
  userData
}) => {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handlePaymentSuccess = (response: any) => {
    console.log('Payment successful:', response);
    setPaymentStatus('success');
    
    // Call the parent's success handler after a short delay
    setTimeout(() => {
      onPaymentSuccess({
        ...response,
        bookingData,
        userData
      });
    }, 2000);
  };

  const handlePaymentClose = () => {
    console.log('Payment modal closed');
    onClose();
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    setPaymentStatus('error');
    setErrorMessage(error.message || 'Payment failed. Please try again.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-space-grotesk font-semibold text-gray-900">
                Complete Payment
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-space-grotesk font-semibold text-gray-900 mb-3">Booking Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Gym:</span>
                <span className="font-medium">{bookingData.gymName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{bookingData.duration} hour{bookingData.duration !== '1' ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{bookingData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{bookingData.time}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <span className="text-gray-600 font-semibold">Total:</span>
                <span className="font-bold text-green-600 text-lg">{bookingData.amount} MAD</span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          {paymentStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-space-grotesk font-semibold text-green-800">Payment Successful!</h4>
                  <p className="text-sm text-green-600">Your booking has been confirmed.</p>
                </div>
              </div>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <h4 className="font-space-grotesk font-semibold text-red-800">Payment Failed</h4>
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Button */}
          {paymentStatus === 'pending' && (
            <div className="space-y-4">
              <div className="text-center text-sm text-gray-600">
                <p className="font-space-grotesk">Secure payment powered by Flutterwave</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-xs">Supports:</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">💳 Cards</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">📱 Mobile Money</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">🏦 Bank Transfer</span>
                </div>
              </div>
              
              <FlutterwavePayment
                amount={bookingData.amount}
                email={userData.email}
                name={userData.name}
                phone={userData.phone}
                gymName={bookingData.gymName}
                bookingId={bookingData.id}
                onSuccess={handlePaymentSuccess}
                onClose={handlePaymentClose}
                onError={handlePaymentError}
              />
            </div>
          )}

          {/* Close Button */}
          {paymentStatus === 'success' && (
            <button
              onClick={onClose}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-space-grotesk font-semibold py-3 px-4 rounded-lg transition-all duration-200"
            >
              Continue
            </button>
          )}

          {paymentStatus === 'error' && (
            <button
              onClick={() => setPaymentStatus('pending')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-space-grotesk font-semibold py-3 px-4 rounded-lg transition-all duration-200"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

