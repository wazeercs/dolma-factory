import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

/* ====== المنتجات ====== */
export function useProducts(branchId = null) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    let query = supabase
      .from('products')
      .select(`
        id, name, category, image_url, in_stock, sort_order,
        product_flavors (id, name, extra_price, sort_order),
        product_variants (id, name, price, sort_order)
      `)
      .order('sort_order');

    if (branchId) query = query.eq('branch_id', branchId);

    const { data, error } = await query;
    if (error) console.error('Error fetching products:', error);
    else {
      const cleaned = (data || []).map((p) => ({
        ...p,
        flavors: (p.product_flavors || []).sort((a, b) => a.sort_order - b.sort_order),
        variants: (p.product_variants || []).sort((a, b) => a.sort_order - b.sort_order),
      }));
      setProducts(cleaned);
    }
    setLoading(false);
  }, [branchId]);

  useEffect(() => {
    fetchProducts();
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchProducts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_variants' }, fetchProducts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_flavors' }, fetchProducts)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [fetchProducts]);

  return { products, loading, refetch: fetchProducts };
}

/* ====== الطلبات ====== */
export function useOrders(branchId = null, onlyActive = false) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    let query = supabase
      .from('orders')
      .select('*, order_items (*)')
      .order('created_at', { ascending: false });

    if (branchId) query = query.eq('branch_id', branchId);
    if (onlyActive) query = query.not('status', 'in', '("delivered","cancelled")');

    const { data, error } = await query;
    if (error) console.error('Error fetching orders:', error);
    else setOrders(data || []);
    setLoading(false);
  }, [branchId, onlyActive]);

  useEffect(() => {
    fetchOrders();
    const channel = supabase
      .channel(`orders-changes-${branchId || 'all'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, fetchOrders)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [fetchOrders, branchId]);

  return { orders, loading, refetch: fetchOrders };
}

/* ====== تتبع طلب واحد (للعميل) ====== */
export function useOrderTracking(orderId) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetch = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*, order_items (*)')
        .eq('id', orderId)
        .single();
      if (data) setOrder(data);
    };
    fetch();

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        (payload) => setOrder((prev) => ({ ...prev, ...payload.new }))
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [orderId]);

  return order;
}

/* ====== المناديب ====== */
export function useDrivers(branchId = null) {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      let q = supabase.from('drivers').select('*');
      if (branchId) q = q.eq('branch_id', branchId);
      const { data } = await q.order('name');
      setDrivers(data || []);
    };
    fetch();
    const ch = supabase
      .channel('drivers-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'drivers' }, fetch)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [branchId]);

  return drivers;
}

/* ====== الفروع ====== */
export function useBranches() {
  const [branches, setBranches] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('branches').select('*').eq('is_active', true);
      setBranches(data || []);
    };
    fetch();
  }, []);
  return branches;
}
