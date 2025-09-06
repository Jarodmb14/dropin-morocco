import React, { useState, useEffect } from 'react';
import { QRCodeGenerator, QRCodeData } from '@/lib/qr-code';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

interface QRCodeDisplayProps {
  booking: any;
  onRefresh?: () => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ booking, onRefresh }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const generateQRCode = async () => {
    try {
      setLoading(true);
      setError('');
      const dataURL = await QRCodeGenerator.generateBookingQRCode(booking);
      setQrCodeDataURL(dataURL);
    } catch (err) {
      setError('Failed to generate QR code');
      console.error('QR code generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [booking]);

  const downloadQRCode = () => {
    if (qrCodeDataURL) {
      const link = document.createElement('a');
      link.download = `booking-${booking.id || booking.booking_id}-qr.png`;
      link.href = qrCodeDataURL;
      link.click();
    }
  };

  const getStatusBadge = () => {
    const status = booking.status || 'CONFIRMED';
    const variants = {
      'CONFIRMED': 'default',
      'PENDING': 'secondary',
      'CANCELLED': 'destructive',
      'COMPLETED': 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status}
      </Badge>
    );
  };

  const getValidityStatus = () => {
    const qrData = QRCodeGenerator.generateBookingQRData(booking);
    const isValid = QRCodeGenerator.isQRCodeValid(qrData);
    
    if (isValid) {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">Valid for gym access</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 text-red-600">
          <XCircle className="h-4 w-4" />
          <span className="text-sm">Expired or not yet valid</span>
        </div>
      );
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Generating QR code...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={generateQRCode} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Gym Access QR Code
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code Display */}
        <div className="flex justify-center">
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
            <img 
              src={qrCodeDataURL} 
              alt="Booking QR Code" 
              className="w-64 h-64"
            />
          </div>
        </div>

        {/* Booking Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Booking ID:</span>
            <span className="font-mono">{booking.id || booking.booking_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Club:</span>
            <span>{booking.club_name || 'Unknown Club'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Start:</span>
            <span>{formatDateTime(booking.scheduled_start)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">End:</span>
            <span>{formatDateTime(booking.scheduled_end)}</span>
          </div>
        </div>

        {/* Validity Status */}
        <div className="pt-2 border-t">
          {getValidityStatus()}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button onClick={downloadQRCode} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download QR Code
          </Button>
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong> Show this QR code at the gym entrance. 
            The code is valid only during your scheduled time slot.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
