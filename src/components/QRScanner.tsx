import React, { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader, Result } from '@zxing/browser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { QRCodeGenerator } from '@/lib/qr-code';
import { Camera, CameraOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onQRCodeScanned: (qrData: string) => void;
  onClose?: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onQRCodeScanned, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [lastScannedCode, setLastScannedCode] = useState<string>('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    return () => {
      // Clean up without calling reset method
      readerRef.current = null;
    };
  }, []);

  const startScanning = async () => {
    try {
      setError('');
      setIsScanning(true);

      if (!readerRef.current) {
        throw new Error('QR reader not initialized');
      }

      console.log('🎥 Starting QR scanner...');

      // Start scanning with default camera (no device selection needed)
      await readerRef.current.decodeFromVideoDevice(
        undefined, // Use default camera
        videoRef.current!,
        (result, error) => {
          if (result) {
            const qrText = result.getText();
            console.log('📱 QR Code scanned:', qrText);
            
            setLastScannedCode(qrText);
            
            // Validate the QR code with better error handling
            try {
              const qrData = QRCodeGenerator.parseQRCodeData(qrText);
              if (qrData) {
                const isValid = QRCodeGenerator.isQRCodeValid(qrData);
                setValidationResult({
                  valid: isValid,
                  data: qrData,
                  message: isValid ? 'QR code is valid for gym access' : 'QR code is expired or not yet valid'
                });
              } else {
                setValidationResult({
                  valid: false,
                  data: null,
                  message: 'Invalid QR code format - not a valid gym booking QR code'
                });
              }
            } catch (parseError) {
              console.error('QR code parsing error:', parseError);
              setValidationResult({
                valid: false,
                data: null,
                message: 'Error parsing QR code - invalid format'
              });
            }
            
            // Call the callback with the scanned data
            onQRCodeScanned(qrText);
            
            // Stop scanning after successful scan
            stopScanning();
          }
          
          if (error && error.name !== 'NotFoundException') {
            console.error('QR scanning error:', error);
            setError(`Scanning error: ${error.message}`);
          }
        }
      );
    } catch (err) {
      console.error('Error starting QR scanner:', err);
      setError(err instanceof Error ? err.message : 'Failed to start camera');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    // Stop the video stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleScanAgain = () => {
    setLastScannedCode('');
    setValidationResult(null);
    setError('');
    startScanning();
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            QR Code Scanner
          </CardTitle>
          {onClose && (
            <Button onClick={onClose} variant="outline" size="sm">
              Close
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera Video */}
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-64 bg-black rounded-lg object-cover"
            playsInline
            muted
          />
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
              <div className="text-center text-white">
                <CameraOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Camera not active</p>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Control Buttons */}
        <div className="flex gap-2 justify-center">
          {!isScanning ? (
            <Button onClick={startScanning} className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Start Scanning
            </Button>
          ) : (
            <Button onClick={stopScanning} variant="destructive" className="flex items-center gap-2">
              <CameraOff className="h-4 w-4" />
              Stop Scanning
            </Button>
          )}
          
          {lastScannedCode && (
            <Button onClick={handleScanAgain} variant="outline">
              Scan Again
            </Button>
          )}
        </div>

        {/* Last Scanned Code */}
        {lastScannedCode && (
          <div className="space-y-3">
            <div className="bg-gray-100 p-3 rounded-lg">
              <h4 className="font-semibold mb-2">Scanned QR Code:</h4>
              <code className="text-sm break-all">{lastScannedCode}</code>
            </div>

            {/* Validation Result */}
            {validationResult && (
              <div className={`p-3 rounded-lg border ${
                validationResult.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {validationResult.valid ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-semibold ${
                    validationResult.valid ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {validationResult.message}
                  </span>
                </div>
                
                {validationResult.data && (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking ID:</span>
                      <span className="font-mono">{validationResult.data.bookingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">User ID:</span>
                      <span className="font-mono">{validationResult.data.userId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Club ID:</span>
                      <span className="font-mono">{validationResult.data.clubId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valid from:</span>
                      <span>{formatDateTime(validationResult.data.scheduledStart)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valid until:</span>
                      <span>{formatDateTime(validationResult.data.scheduledEnd)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={validationResult.valid ? 'default' : 'destructive'}>
                        {validationResult.data.status}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong> Click "Start Scanning" to activate your camera. 
            Point the camera at a QR code to scan it. The scanner will automatically validate 
            the QR code and show the booking details.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
