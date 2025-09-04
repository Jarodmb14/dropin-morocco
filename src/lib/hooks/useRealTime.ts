import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface RealtimeConfig {
  table: string;
  filters?: Record<string, any>;
  onInsert?: (payload: RealtimePostgresChangesPayload<any>) => void;
  onUpdate?: (payload: RealtimePostgresChangesPayload<any>) => void;
  onDelete?: (payload: RealtimePostgresChangesPayload<any>) => void;
}

/**
 * Hook for real-time subscriptions to Supabase tables
 */
export const useRealTime = (config: RealtimeConfig) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let channel = supabase.channel(`realtime:${config.table}`);

    // Build the postgres changes config
    let changesConfig: any = {
      event: '*',
      schema: 'public',
      table: config.table,
    };

    // Add filters if provided
    if (config.filters) {
      changesConfig.filter = Object.entries(config.filters)
        .map(([key, value]) => `${key}=eq.${value}`)
        .join(',');
    }

    channel = channel.on('postgres_changes', changesConfig, (payload) => {
      switch (payload.eventType) {
        case 'INSERT':
          config.onInsert?.(payload);
          break;
        case 'UPDATE':
          config.onUpdate?.(payload);
          break;
        case 'DELETE':
          config.onDelete?.(payload);
          break;
      }
    });

    channel
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          setError(null);
        } else if (status === 'CHANNEL_ERROR') {
          setIsConnected(false);
          setError('Real-time connection error');
        } else if (status === 'TIMED_OUT') {
          setIsConnected(false);
          setError('Real-time connection timed out');
        }
      });

    return () => {
      channel.unsubscribe();
      setIsConnected(false);
    };
  }, [config.table, JSON.stringify(config.filters)]);

  return { isConnected, error };
};

/**
 * Hook for real-time club capacity updates
 */
export const useClubCapacity = (clubId: string) => {
  const [capacity, setCapacity] = useState<{
    max_capacity: number;
    current_occupancy: number;
    date: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial capacity
  useEffect(() => {
    const fetchCapacity = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('club_capacity')
          .select('*')
          .eq('club_id', clubId)
          .eq('date', today)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        setCapacity(data || {
          max_capacity: 100, // Default capacity
          current_occupancy: 0,
          date: today,
        });
      } catch (error) {
        console.error('Fetch capacity error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCapacity();
  }, [clubId]);

  // Subscribe to real-time capacity updates
  useRealTime({
    table: 'club_capacity',
    filters: { club_id: clubId },
    onUpdate: (payload) => {
      setCapacity(payload.new as any);
    },
    onInsert: (payload) => {
      setCapacity(payload.new as any);
    },
  });

  // Subscribe to check-ins to update occupancy
  useRealTime({
    table: 'checkins',
    filters: { club_id: clubId },
    onInsert: () => {
      // Increment occupancy
      setCapacity(prev => prev ? {
        ...prev,
        current_occupancy: prev.current_occupancy + 1,
      } : null);
    },
  });

  const isAtCapacity = capacity ? capacity.current_occupancy >= capacity.max_capacity : false;
  const occupancyRate = capacity ? (capacity.current_occupancy / capacity.max_capacity) * 100 : 0;

  return {
    capacity,
    isLoading,
    isAtCapacity,
    occupancyRate: Math.round(occupancyRate),
  };
};

/**
 * Hook for real-time order updates
 */
export const useOrderUpdates = (userId?: string) => {
  const [newOrders, setNewOrders] = useState<any[]>([]);
  const [orderUpdates, setOrderUpdates] = useState<any[]>([]);

  useRealTime({
    table: 'orders',
    filters: userId ? { user_id: userId } : undefined,
    onInsert: (payload) => {
      setNewOrders(prev => [payload.new, ...prev].slice(0, 10));
    },
    onUpdate: (payload) => {
      setOrderUpdates(prev => [payload.new, ...prev].slice(0, 10));
    },
  });

  const clearNewOrders = () => setNewOrders([]);
  const clearOrderUpdates = () => setOrderUpdates([]);

  return {
    newOrders,
    orderUpdates,
    clearNewOrders,
    clearOrderUpdates,
  };
};

/**
 * Hook for real-time QR code updates
 */
export const useQRCodeUpdates = (userId?: string) => {
  const [qrCodeUpdates, setQRCodeUpdates] = useState<any[]>([]);

  useRealTime({
    table: 'qr_codes',
    onUpdate: (payload) => {
      // Filter by user if needed (through order relationship)
      setQRCodeUpdates(prev => [payload.new, ...prev].slice(0, 10));
    },
  });

  const clearQRCodeUpdates = () => setQRCodeUpdates([]);

  return {
    qrCodeUpdates,
    clearQRCodeUpdates,
  };
};

/**
 * Hook for real-time admin notifications
 */
export const useAdminNotifications = () => {
  const [newUsers, setNewUsers] = useState<any[]>([]);
  const [newClubs, setNewClubs] = useState<any[]>([]);
  const [newOrders, setNewOrders] = useState<any[]>([]);
  const [paymentIssues, setPaymentIssues] = useState<any[]>([]);

  // New user registrations
  useRealTime({
    table: 'profiles',
    onInsert: (payload) => {
      setNewUsers(prev => [payload.new, ...prev].slice(0, 5));
    },
  });

  // New club submissions
  useRealTime({
    table: 'clubs',
    onInsert: (payload) => {
      setNewClubs(prev => [payload.new, ...prev].slice(0, 5));
    },
  });

  // New orders
  useRealTime({
    table: 'orders',
    onInsert: (payload) => {
      setNewOrders(prev => [payload.new, ...prev].slice(0, 5));
    },
  });

  // Payment failures
  useRealTime({
    table: 'payments',
    onInsert: (payload) => {
      if (payload.new.status === 'failed') {
        setPaymentIssues(prev => [payload.new, ...prev].slice(0, 5));
      }
    },
  });

  const totalNotifications = newUsers.length + newClubs.length + newOrders.length + paymentIssues.length;

  const clearAll = () => {
    setNewUsers([]);
    setNewClubs([]);
    setNewOrders([]);
    setPaymentIssues([]);
  };

  return {
    newUsers,
    newClubs,
    newOrders,
    paymentIssues,
    totalNotifications,
    clearAll,
  };
};

/**
 * Hook for real-time club owner notifications
 */
export const useClubOwnerNotifications = (clubId: string) => {
  const [newBookings, setNewBookings] = useState<any[]>([]);
  const [capacityAlerts, setCapacityAlerts] = useState<any[]>([]);

  // Monitor check-ins to club
  useRealTime({
    table: 'checkins',
    filters: { club_id: clubId },
    onInsert: (payload) => {
      setNewBookings(prev => [payload.new, ...prev].slice(0, 10));
    },
  });

  // Monitor capacity updates for alerts
  const { capacity, occupancyRate } = useClubCapacity(clubId);

  useEffect(() => {
    if (capacity && occupancyRate >= 90) {
      setCapacityAlerts(prev => [{
        id: Date.now(),
        message: `Club is at ${occupancyRate}% capacity`,
        timestamp: new Date().toISOString(),
      }, ...prev].slice(0, 5));
    }
  }, [occupancyRate]);

  const totalNotifications = newBookings.length + capacityAlerts.length;

  const clearBookings = () => setNewBookings([]);
  const clearCapacityAlerts = () => setCapacityAlerts([]);

  return {
    newBookings,
    capacityAlerts,
    totalNotifications,
    clearBookings,
    clearCapacityAlerts,
  };
};
