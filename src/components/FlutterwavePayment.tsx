import React from 'react';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';

interface FlutterwavePaymentProps {
  amount: number;
  email: string;
  name: string;
  phone: string;
  gymName: string;
  bookingId: string;
  onSuccess: (response: any) => void;
  onClose: () => void;
  onError: (error: any) => void;
}

const FlutterwavePayment: React.FC<FlutterwavePaymentProps> = ({
  amount,
  email,
  name,
  phone,
  gymName,
  bookingId,
  onSuccess,
  onClose,
  onError
}) => {
  // Flutterwave configuration
  const config = {
    public_key: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-1234567890abcdef1234567890abcdef-X', // Replace with your actual public key
    tx_ref: `booking_${bookingId}_${Date.now()}`,
    amount: amount,
    currency: 'MAD',
    payment_options: 'card,mobilemoney,banktransfer',
    customer: {
      email: email,
      phone_number: phone,
      name: name,
    },
    customizations: {
      title: 'Drop-In Morocco',
      description: `Payment for ${gymName} booking`,
      logo: 'https://dropinmorocco.vercel.app/icon-192.webp',
    },
    callback: (response: any) => {
      console.log('Flutterwave payment response:', response);
      if (response.status === 'successful') {
        onSuccess(response);
      } else {
        onError(new Error('Payment was not successful'));
      }
      closePaymentModal();
    },
    onclose: () => {
      console.log('Flutterwave payment modal closed');
      onClose();
    },
  };

  const handleFlutterPayment = () => {
    console.log('Initiating Flutterwave payment...');
  };

  return (
    <div className="w-full">
      <FlutterWaveButton
        {...config}
        text="Pay with Flutterwave"
        callback={config.callback}
        onclose={config.onclose}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-space-grotesk font-semibold py-3 px-4 rounded-lg transition-all duration-200"
        style={{
          width: '100%',
          backgroundColor: '#059669',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      />
      
      {/* Fallback button for testing */}
      <button
        onClick={handleFlutterPayment}
        className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white font-space-grotesk font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
      >
        Test Payment (Demo)
      </button>
    </div>
  );
};

export default FlutterwavePayment;
