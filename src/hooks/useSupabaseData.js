import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  fetchProducts,
  fetchOrders,
  fetchDrivers,
  fetchActiveBranches,
  trackOrder,
} from '../services/supabase';

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

  useEffect(() => {
    load();
    const ch = supabase.channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_variants' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_flavors' }, load)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [load]);

  return { products, loading, error, refetch: load };
}

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

  useEffect(() => {
    load();
    const ch = supabase.channel(`orders-changes-${branchId || 'all'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, load)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [load, branchId]);

  return { orders, loading, error, refetch: load };
}

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
      const data = await fetchDrivers(branchId);
      setDrivers(data);
    } catch (err) {
      setError(err.message || 'فشل تحميل المناديب');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    load();
    const ch = supabase.channel('drivers-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'drivers' }, load)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [load]);

  return { drivers, loading, error, refetch: load };
}

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
