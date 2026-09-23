import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  fetchProducts,
  fetchOrders,
  fetchDrivers,
  fetchActiveBranches,
  trackOrder,
} from '../services/supabase';

/**
 * useRealtimeChannel — Hook موحد لإدارة اشتراكات Realtime بأمان
 * - يضمن cleanup تلقائي
 * - يمنع الاشتراكات المكررة
 * - يضيف حالة الاتصال
 */
function useRealtimeChannel(channelName, configs, callback, deps = []) {
  const [status, setStatus] = useState('connecting');
  const channelRef = useRef(null);

  useEffect(() => {
    if (!channelName || !configs?.length) return;

    // إزالة أي قناة سابقة
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    let channel = supabase.channel(channelName);
    configs.forEach(({ event, schema, table, filter }) => {
      channel = channel.on(
        'postgres_changes',
        { event, schema: schema || 'public', table, ...(filter ? { filter } : {}) },
        (payload) => callback(payload)
      );
    });

    channel.subscribe((s) => {
      setStatus(s);
      if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT') {
        console.warn(`[Realtime] ${channelName} → ${s}`);
      }
    });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return status;
}

// ═══ Products ═══
export function useProducts(branchId = null) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchProducts(branchId);
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

// ═══ Orders ═══
export function useOrders(branchId = null, onlyActive = false) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchOrders({ branchId, onlyActive });
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

// ═══ Order Tracking (Customer) ═══
export function useOrderTracking(orderNumber, phone) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderNumber || !phone) return;

    const load = async () => {
      try {
        const data = await trackOrder(orderNumber, phone);
        setOrder(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };

    load();
    // Polling كل 5 ثوان — لا Realtime لأن الزبون not authenticated
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [orderNumber, phone]);

  return order;
}

// ═══ Drivers ═══
export function useDrivers(branchId = null) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchDrivers(branchId);
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
    [
      { event: '*', table: 'drivers', filter: branchId ? `branch_id=eq.${branchId}` : undefined },
    ],
    load,
    [branchId]
  );

  return { drivers, loading, error, refetch: load };
}

// ═══ Branches ═══
export function useBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchActiveBranches()
      .then((data) => mounted && setBranches(data))
      .catch((err) => console.error('branches:', err))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return branches;
}
