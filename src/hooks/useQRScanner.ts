import { useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

interface QRScanResult {
  hasContent: boolean;
  content: string;
}

interface QRScannerState {
  isScanning: boolean;
  result: string | null;
  error: string | null;
  isSupported: boolean;
}

export const useQRScanner = () => {
  const [scannerState, setScannerState] = useState<QRScannerState>({
    isScanning: false,
    result: null,
    error: null,
    isSupported: Capacitor.isNativePlatform() || (window.navigator && 'mediaDevices' in window.navigator),
  });

  const checkPermissions = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) {
      // For web, check if camera access is available
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (error) {
        setScannerState(prev => ({ 
          ...prev, 
          error: 'Camera access is required for QR scanning' 
        }));
        return false;
      }
    }

    try {
      const status = await BarcodeScanner.checkPermission({ force: false });
      
      if (status.granted) {
        return true;
      }

      if (status.denied) {
        // Request permission
        const permissionResult = await BarcodeScanner.checkPermission({ force: true });
        return permissionResult.granted;
      }

      return false;
    } catch (error) {
      setScannerState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to check camera permissions' 
      }));
      return false;
    }
  }, []);

  const startScan = useCallback(async () => {
    setScannerState(prev => ({ ...prev, isScanning: true, error: null, result: null }));

    try {
      const hasPermission = await checkPermissions();
      if (!hasPermission) {
        setScannerState(prev => ({ 
          ...prev, 
          isScanning: false, 
          error: 'Camera permission is required' 
        }));
        return;
      }

      if (Capacitor.isNativePlatform()) {
        // Native scanning
        await BarcodeScanner.hideBackground();
        
        const result: QRScanResult = await BarcodeScanner.startScan();
        
        await BarcodeScanner.showBackground();
        
        if (result.hasContent) {
          setScannerState(prev => ({ 
            ...prev, 
            isScanning: false, 
            result: result.content 
          }));
        } else {
          setScannerState(prev => ({ 
            ...prev, 
            isScanning: false, 
            error: 'No QR code detected' 
          }));
        }
      } else {
        // Web scanning (this will be handled by the component)
        setScannerState(prev => ({ ...prev, isScanning: true }));
      }
    } catch (error) {
      await BarcodeScanner.showBackground();
      setScannerState(prev => ({ 
        ...prev, 
        isScanning: false, 
        error: error instanceof Error ? error.message : 'Failed to scan QR code' 
      }));
    }
  }, [checkPermissions]);

  const stopScan = useCallback(async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await BarcodeScanner.stopScan();
        await BarcodeScanner.showBackground();
      }
      setScannerState(prev => ({ ...prev, isScanning: false }));
    } catch (error) {
      console.error('Error stopping scan:', error);
    }
  }, []);

  const clearResult = useCallback(() => {
    setScannerState(prev => ({ ...prev, result: null, error: null }));
  }, []);

  const setWebScanResult = useCallback((result: string) => {
    setScannerState(prev => ({ 
      ...prev, 
      isScanning: false, 
      result: result 
    }));
  }, []);

  const setWebScanError = useCallback((error: string) => {
    setScannerState(prev => ({ 
      ...prev, 
      isScanning: false, 
      error: error 
    }));
  }, []);

  return {
    ...scannerState,
    startScan,
    stopScan,
    clearResult,
    setWebScanResult,
    setWebScanError,
  };
};
