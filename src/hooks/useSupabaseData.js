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

function useRealtimeChannel(channelName, configs, callback, deps = []) {
  const [status, setStatus] = useState('connecting');
  const channelRef = useRef(null);

  useEffect(() => {
    if (!channelName || !configs?.length) return;
    if (channelRef.current) supabase.removeChannel(channelRef.current);

    let channel = supabase.channel(channelName);
    configs.forEach(({ event, schema, table, filter }) => {
      channel = channel.on(
        'postgres_changes',
        { event, schema: schema || 'public', table, ...(filter ? { filter } : {}) },
        (payload) => callback(payload)
      );
    });

    channel.subscribe((s) => setStatus(s));
    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, deps);

  return status;
}

export function useProducts(branchId = null) {
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

  useEffect(() => { load(); }, [load]);

  useRealtimeChannel(
    `products-${branchId || 'all'}`,
    [
      { event: '*', table: 'products', filter: branchId ? `branch_id=eq.${branchId}` : undefined },
      { event: '*', table: 'product_variants' },
      { event: '*', table: 'product_flavors' },
    ],
    load,
    [branchId]
  );

  return { products, loading, error, refetch: load };
}

export function useOrders(branchId = null, onlyActive = false) {
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

  useEffect(() => { load(); }, [load]);

  useRealtimeChannel(
    `orders-${branchId || 'all'}-${onlyActive ? 'active' : 'all'}`,
    [
      { event: '*', table: 'orders', filter: branchId ? `branch_id=eq.${branchId}` : undefined },
      { event: '*', table: 'order_items' },
    ],
    load,
    [branchId, onlyActive]
  );

  return { orders, loading, error, refetch: load };
}

export function useOrderTracking(orderNumber, phone) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderNumber || !phone) return;

    const load = async () => {
      try {
        const data = await withRetry(() => trackOrder(orderNumber, phone), {
          maxAttempts: 2,
          shouldRetry: isRetryableError,
        });
        setOrder(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [orderNumber, phone]);

  return order;
}

export function useDrivers(branchId = null) {
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

  useEffect(() => { load(); }, [load]);

  useRealtimeChannel(
    `drivers-${branchId || 'all'}`,
    [{ event: '*', table: 'drivers', filter: branchId ? `branch_id=eq.${branchId}` : undefined }],
    load,
    [branchId]
  );

  return { drivers, loading, error, refetch: load };
}

export function useBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    withRetry(() => fetchActiveBranches(), {
      maxAttempts: 3,
      shouldRetry: isRetryableError,
    })
      .then((data) => mounted && setBranches(data))
      .catch((err) => console.error('branches:', err))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return branches;
}
