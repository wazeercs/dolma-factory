import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { withRetry, isRetryableError } from '../lib/retry';
import {
  fetchProducts,
  fetchOrders,
  fetchDrivers,
  fetchActiveBranches,
  trackOrder,
} from '../services/supabase';

function useRealtimeChannel(channelName, configs, callback, deps = [], enabled = true) {
  const [status, setStatus] = useState('connecting');
  const channelRef = useRef(null);
  const callbackTimerRef = useRef(null);
  const callbackInFlightRef = useRef(false);
  const callbackQueuedRef = useRef(false);
  const latestPayloadRef = useRef(null);

  useEffect(() => {
    if (!enabled || !channelName || !configs?.length) return;
    if (channelRef.current) supabase.removeChannel(channelRef.current);

    let channel = supabase.channel(channelName);

    const scheduleCallback = (payload) => {
      latestPayloadRef.current = payload;

      if (callbackTimerRef.current !== null) return;

      callbackTimerRef.current = setTimeout(async () => {
        callbackTimerRef.current = null;

        if (callbackInFlightRef.current) {
          callbackQueuedRef.current = true;
          return;
        }

        callbackInFlightRef.current = true;
        callbackQueuedRef.current = false;

        try {
          await callback(latestPayloadRef.current);
        } finally {
          callbackInFlightRef.current = false;

          if (callbackQueuedRef.current && callbackTimerRef.current === null) {
            callbackTimerRef.current = setTimeout(() => {
              callbackTimerRef.current = null;

              if (callbackInFlightRef.current) {
                callbackQueuedRef.current = true;
                return;
              }

              callbackInFlightRef.current = true;
              callbackQueuedRef.current = false;

              Promise.resolve(callback(latestPayloadRef.current))
                .catch(() => {})
                .finally(() => {
                  callbackInFlightRef.current = false;

                  if (
                    callbackQueuedRef.current &&
                    callbackTimerRef.current === null
                  ) {
                    callbackTimerRef.current = setTimeout(() => {
                      callbackTimerRef.current = null;
                      if (callbackInFlightRef.current) {
                        callbackQueuedRef.current = true;
                        return;
                      }

                      callbackInFlightRef.current = true;
                      callbackQueuedRef.current = false;

                      Promise.resolve(callback(latestPayloadRef.current))
                        .catch(() => {})
                        .finally(() => {
                          callbackInFlightRef.current = false;
                        });
                    }, 150);
                  }
                });
            }, 150);
          }
        }
      }, 150);
    };

    configs.forEach(({ event, schema, table, filter }) => {
      channel = channel.on(
        'postgres_changes',
        { event, schema: schema || 'public', table, ...(filter ? { filter } : {}) },
        scheduleCallback
      );
    });

    channel.subscribe((s) => setStatus(s));
    channelRef.current = channel;

    return () => {
      if (callbackTimerRef.current !== null) {
        clearTimeout(callbackTimerRef.current);
        callbackTimerRef.current = null;
      }

      callbackQueuedRef.current = false;
      latestPayloadRef.current = null;

      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, deps);

  return status;
}

export function useProducts(branchId = null, enabled = true) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await withRetry(() => fetchProducts(branchId), {
        maxAttempts: 3,
        shouldRetry: isRetryableError,
      });
      setProducts(data);
    } catch (err) {
      setError(err.message || 'فشل تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    if (!enabled) return;
    load();
  }, [load, enabled]);

  useRealtimeChannel(
    `products-${branchId || 'all'}`,
    [
      { event: '*', table: 'products', filter: branchId ? `branch_id=eq.${branchId}` : undefined },
      { event: '*', table: 'product_variants' },
      { event: '*', table: 'product_flavors' },
    ],
    load,
    [branchId, enabled],
    enabled
  );

  return { products, loading, error, refetch: load };
}

export function useOrders(branchId = null, onlyActive = false, enabled = true) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await withRetry(
        () => fetchOrders({ branchId, onlyActive }),
        { maxAttempts: 3, shouldRetry: isRetryableError }
      );
      setOrders(data);
    } catch (err) {
      setError(err.message || 'فشل تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  }, [branchId, onlyActive]);

  useEffect(() => {
    if (!enabled) return;
    load();
  }, [load, enabled]);

  useRealtimeChannel(
    `orders-${branchId || 'all'}-${onlyActive ? 'active' : 'all'}`,
    [
      { event: '*', table: 'orders', filter: branchId ? `branch_id=eq.${branchId}` : undefined },
      { event: '*', table: 'order_items' },
    ],
    load,
    [branchId, onlyActive, enabled],
    enabled
  );

  return { orders, loading, error, refetch: load };
}

export function useOrderTracking(orderNumber, phone) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderNumber || !phone) return;

    let interval = null;

    const startPolling = () => {
      if (interval !== null) return;
      interval = setInterval(checkAndPoll, 7000);
    };

    const stopPolling = () => {
      if (interval !== null) {
        clearInterval(interval);
        interval = null;
      }
    };

    const checkAndPoll = async () => {
      try {
        const data = await withRetry(() => trackOrder(orderNumber, phone), {
          maxAttempts: 2,
          shouldRetry: isRetryableError,
        });

        setOrder(data);
        setError(null);

        // إيقاف التحديث الدوري عند انتهاء الطلب
        if (['delivered', 'cancelled', 'rejected'].includes(data?.status)) {
          stopPolling();
        } else {
          startPolling();
        }
      } catch (err) {
        setError(err.message);
        startPolling();
      }
    };

    checkAndPoll();

    return () => {
      stopPolling();
    };
  }, [orderNumber, phone]);

  return order;
}

export function useDrivers(branchId = null, enabled = true) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await withRetry(() => fetchDrivers(branchId), {
        maxAttempts: 3,
        shouldRetry: isRetryableError,
      });
      setDrivers(data);
    } catch (err) {
      setError(err.message || 'فشل تحميل المناديب');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    if (!enabled) return;
    load();
  }, [load, enabled]);

  useRealtimeChannel(
    `drivers-${branchId || 'all'}`,
    [{ event: '*', table: 'drivers', filter: branchId ? `branch_id=eq.${branchId}` : undefined }],
    load,
    [branchId, enabled],
    enabled
  );

  return { drivers, loading, error, refetch: load };
}

export function useBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await withRetry(() => fetchActiveBranches(), {
        maxAttempts: 3,
        shouldRetry: isRetryableError,
      });
      setBranches(data);
    } catch (err) {
      console.error('branches:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRealtimeChannel(
    'branches-active',
    [{ event: '*', table: 'branches', filter: 'is_active=eq.true' }],
    load,
    [load]
  );

  return branches;
}
