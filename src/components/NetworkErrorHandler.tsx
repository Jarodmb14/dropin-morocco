import { useState, useEffect } from 'react';

interface NetworkErrorHandlerProps {
  children: React.ReactNode;
}

const NetworkErrorHandler = ({ children }: NetworkErrorHandlerProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {children}
      
      {/* Offline Banner */}
      {showOfflineMessage && !isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-3 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg">📡</span>
            <span className="font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              You're offline. Some features may not work properly.
            </span>
            <button
              onClick={() => setShowOfflineMessage(false)}
              className="ml-4 text-white hover:text-gray-200 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Online Banner */}
      {isOnline && showOfflineMessage && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white px-4 py-3 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg">✅</span>
            <span className="font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              You're back online!
            </span>
            <button
              onClick={() => setShowOfflineMessage(false)}
              className="ml-4 text-white hover:text-gray-200 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NetworkErrorHandler;
