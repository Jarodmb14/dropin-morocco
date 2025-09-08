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

  const downloadQRCode = async () => {
    try {
      await QRCodeGenerator.downloadQRCodePNG(booking);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download QR code. Please try again.');
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
    <div className="qr-code-container">
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          {/* QR Code Display */}
          <div className="flex justify-center mb-4">
            <div className="border-2 border-gray-300 rounded-xl p-6 bg-white shadow-sm">
              <img 
                src={qrCodeDataURL} 
                alt="Booking QR Code" 
                className="w-48 h-48"
              />
            </div>
          </div>

          {/* Validity Status */}
          <div className="text-center mb-4">
            {getValidityStatus()}
          </div>

          {/* Booking Details */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 font-space-grotesk">Booking ID:</span>
              <span className="font-mono font-space-grotesk font-medium">{booking.id?.slice(0, 8) || booking.booking_id?.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-space-grotesk">Club:</span>
              <span className="font-space-grotesk font-medium">{booking.club_name || 'Unknown Club'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-space-grotesk">Start:</span>
              <span className="font-space-grotesk font-medium">{formatDateTime(booking.scheduled_start)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-space-grotesk">End:</span>
              <span className="font-space-grotesk font-medium">{formatDateTime(booking.scheduled_end)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={downloadQRCode} 
              className="flex-1 font-space-grotesk font-medium"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
