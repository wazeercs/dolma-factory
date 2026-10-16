import { useState, useEffect, useCallback } from 'react';
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

  useEffect(() => {
    if (!enabled || !channelName || !configs?.length) return;

    let active = true;
    let timer = null;
    let callbackInFlight = false;
    let callbackQueued = false;
    let latestPayload = null;

    let channel = supabase.channel(channelName);

    const scheduleCallback = (payload) => {
      if (!active) return;

      latestPayload = payload;

      if (timer !== null) return;

      const runCallback = async () => {
        timer = null;

        if (!active) return;

        if (callbackInFlight) {
          callbackQueued = true;
          return;
        }

        callbackInFlight = true;
        callbackQueued = false;

        try {
          await callback(latestPayload);
        } catch {
          // Keep realtime synchronization alive after callback failures.
        } finally {
          callbackInFlight = false;

          if (active && callbackQueued) {
            callbackQueued = false;
            timer = setTimeout(runCallback, 150);
          }
        }
      };

      timer = setTimeout(runCallback, 150);
    };

    configs.forEach(({ event, schema, table, filter }) => {
      channel = channel.on(
        'postgres_changes',
        { event, schema: schema || 'public', table, ...(filter ? { filter } : {}) },
        scheduleCallback
      );
    });

    channel.subscribe((s) => {
      if (active) setStatus(s);
    });

    return () => {
      active = false;

      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }

      callbackQueued = false;
      latestPayload = null;

      supabase.removeChannel(channel);
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

    let timeoutId = null;
    let cancelled = false;

    const scheduleNext = () => {
      if (!cancelled) {
        timeoutId = setTimeout(checkAndPoll, 7000);
      }
    };

    const checkAndPoll = async () => {
      try {
        const data = await withRetry(() => trackOrder(orderNumber, phone), {
          maxAttempts: 2,
          shouldRetry: isRetryableError,
        });

        if (cancelled) return;

        setOrder(data);
        setError(null);

        if (['delivered', 'cancelled', 'rejected'].includes(data?.status)) {
          return;
        }

        scheduleNext();
      } catch (err) {
        if (cancelled) return;

        setError(err?.message || 'Unable to track order');
        scheduleNext();
      }
    };

    checkAndPoll();

    return () => {
      cancelled = true;

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
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
