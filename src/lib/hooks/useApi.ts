import { useState, useEffect, useCallback } from 'react';
import { DropInAPI } from '@/lib/api';
import type { AuthUser } from '@/lib/api';

/**
 * Hook for authentication state management
 */
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      try {
        const currentUser = await DropInAPI.auth.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Auth error');
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen to auth changes
    const { data: { subscription } } = DropInAPI.auth.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await DropInAPI.auth.signIn(email, password);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, userData: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await DropInAPI.auth.signUp(email, password, userData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await DropInAPI.auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isClubOwner: user?.role === 'CLUB_OWNER',
    isCustomer: user?.role === 'CUSTOMER',
  };
};

/**
 * Hook for fetching clubs with filters
 */
export const useClubs = (filters?: any) => {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClubs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DropInAPI.clubs.getClubs(filters);
      setClubs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clubs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  return {
    clubs,
    loading,
    error,
    refetch: fetchClubs,
  };
};

/**
 * Hook for fetching products
 */
export const useProducts = (filters?: any) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DropInAPI.products.getProducts(filters);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};

/**
 * Hook for user orders
 */
export const useOrders = (userId?: string) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DropInAPI.orders.getUserOrders(userId);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(async (orderData: any) => {
    try {
      const order = await DropInAPI.orders.createOrder(orderData);
      setOrders(prev => [order, ...prev]);
      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      throw err;
    }
  }, []);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    createOrder,
  };
};

/**
 * Hook for user QR codes
 */
export const useQRCodes = (userId?: string) => {
  const [qrCodes, setQRCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQRCodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DropInAPI.qrCodes.getUserQRCodes(userId);
      setQRCodes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch QR codes');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchQRCodes();
  }, [fetchQRCodes]);

  const scanQRCode = useCallback(async (qrCode: string, clubId: string) => {
    try {
      const result = await DropInAPI.qrCodes.scanQRCode(qrCode, clubId);
      if (result.success) {
        // Update QR codes list
        fetchQRCodes();
      }
      return result;
    } catch (err) {
      throw err;
    }
  }, [fetchQRCodes]);

  return {
    qrCodes,
    loading,
    error,
    refetch: fetchQRCodes,
    scanQRCode,
  };
};

/**
 * Hook for geolocation-based club search
 */
export const useNearbyClubs = () => {
  const [nearbyClubs, setNearbyClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        });
      });

      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setLocation(coords);

      // Fetch nearby clubs
      const clubs = await DropInAPI.clubs.getNearbyClubs(
        coords.latitude,
        coords.longitude,
        10 // 10km radius
      );

      setNearbyClubs(clubs);
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please enable location services.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred while fetching location.');
        }
      } else {
        setError('Failed to fetch nearby clubs');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const searchNearby = useCallback(async (radius: number = 10) => {
    if (!location) {
      await getCurrentLocation();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const clubs = await DropInAPI.clubs.getNearbyClubs(
        location.latitude,
        location.longitude,
        radius
      );
      setNearbyClubs(clubs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search nearby clubs');
    } finally {
      setLoading(false);
    }
  }, [location, getCurrentLocation]);

  return {
    nearbyClubs,
    loading,
    error,
    location,
    getCurrentLocation,
    searchNearby,
  };
};

/**
 * Hook for admin dashboard data
 */
export const useAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DropInAPI.getAdminDashboard();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboardData,
    loading,
    error,
    refetch: fetchDashboard,
  };
};

/**
 * Hook for complete purchase flow
 */
export const usePurchaseFlow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchaseProduct = useCallback(async (productId: string, clubTier?: any) => {
    setLoading(true);
    setError(null);

    try {
      const result = await DropInAPI.customerPurchaseFlow(productId, clubTier);
      
      if (!result.success) {
        setError(result.error || 'Purchase failed');
        return null;
      }

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    purchaseProduct,
  };
};

/**
 * Hook for club owner scanning flow
 */
export const useClubScanFlow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanQRCode = useCallback(async (qrCode: string, clubId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await DropInAPI.clubOwnerScanFlow(qrCode, clubId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed');
      return {
        success: false,
        message: 'Error processing QR code',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    scanQRCode,
  };
};
