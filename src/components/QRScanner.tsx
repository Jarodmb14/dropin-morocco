import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, X, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import { useQRScanner } from '@/hooks/useQRScanner';
import { useIsMobile } from '@/hooks/use-mobile';

interface QRScannerProps {
  onScanResult?: (result: string) => void;
  onClose?: () => void;
  title?: string;
}

const QRScanner: React.FC<QRScannerProps> = ({ 
  onScanResult, 
  onClose, 
  title = "QR Code Scanner" 
}) => {
  const { 
    isScanning, 
    result, 
    error, 
    isSupported, 
    startScan, 
    stopScan, 
    clearResult,
    setWebScanResult,
    setWebScanError
  } = useQRScanner();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  const isNative = Capacitor.isNativePlatform();

  // Web-based QR scanning fallback
  useEffect(() => {
    if (!isNative && isScanning && videoRef.current) {
      let stream: MediaStream | null = null;
      let animationId: number;

      const initWebScanner = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            } 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          
          // Use native BarcodeDetector API if available
          const hasBarcodeDetector = typeof (window as any).BarcodeDetector !== 'undefined';
          let detector: any = null;
          if (hasBarcodeDetector) {
            // @ts-expect-error - BarcodeDetector is not in TS lib by default
            detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
          } else {
            setWebScanError('BarcodeDetector API not supported in this browser.');
          }
          
          const detectQR = async () => {
            if (videoRef.current && canvasRef.current && detector) {
              const video = videoRef.current;
              const canvas = canvasRef.current;
              const ctx = canvas.getContext('2d');
              
              if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0);
                
                try {
                  const barcodes = await detector.detect(canvas);
                  
                  if (barcodes.length > 0) {
                    setWebScanResult(barcodes[0].rawValue);
                    return;
                  }
                } catch (err) {
                  console.error('Barcode detection error:', err);
                }
              }
              
              animationId = requestAnimationFrame(detectQR);
            }
          };

          detectQR();
        } catch (err) {
          setWebScanError('Failed to access camera for web scanning');
        }
      };

      initWebScanner();

      return () => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }
  }, [isNative, isScanning, setWebScanResult, setWebScanError]);

  // Handle scan result
  useEffect(() => {
    if (result && onScanResult) {
      onScanResult(result);
    }
  }, [result, onScanResult]);

  const handleStartScan = () => {
    clearResult();
    startScan();
  };

  const handleStopScan = () => {
    stopScan();
  };

  const handleClose = () => {
    if (isScanning) {
      stopScan();
    }
    onClose?.();
  };

  if (!isSupported) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Scanner Not Available
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            QR code scanning is not supported on this device or browser.
          </p>
          {onClose && (
            <Button onClick={onClose} variant="outline" className="w-full">
              Close
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md'} mx-auto`}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            {title}
          </div>
          {onClose && (
            <Button 
              onClick={handleClose} 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Scanner Status */}
        {isScanning && isNative && (
          <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Camera className="h-12 w-12 mx-auto mb-2 text-blue-500 animate-pulse" />
            <p className="text-sm font-medium">Camera is active</p>
            <p className="text-xs text-muted-foreground mt-1">
              Point your camera at a QR code
            </p>
          </div>
        )}

        {/* Web Scanner View */}
        {isScanning && !isNative && (
          <div className="relative">
            <video 
              ref={videoRef}
              className="w-full h-64 object-cover rounded-lg bg-black"
              playsInline
              muted
            />
            <canvas 
              ref={canvasRef}
              className="hidden"
            />
            <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
              <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg"></div>
            </div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              Align QR code within frame
            </div>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  QR Code Scanned
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 break-all">
                  {result}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  Scan Error
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {!isScanning ? (
            <Button 
              onClick={handleStartScan} 
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              <Camera className="h-5 w-5 mr-2" />
              Start Scanning
            </Button>
          ) : (
            <Button 
              onClick={handleStopScan} 
              variant="destructive" 
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              <X className="h-5 w-5 mr-2" />
              Stop Scanning
            </Button>
          )}

          {result && (
            <Button 
              onClick={clearResult} 
              variant="outline" 
              className="w-full"
            >
              Scan Another Code
            </Button>
          )}
        </div>

        {/* Native App Note */}
        {isNative && (
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              📱 Native camera integration active
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRScanner;
