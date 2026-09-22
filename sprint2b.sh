#!/data/data/com.termux/files/usr/bin/bash
set -e

# ============================================
# src/hooks/useSupabaseData.js (نسخة محدثة)
# ============================================
cat > src/hooks/useSupabaseData.js << 'EOF'
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  fetchProducts,
  fetchOrders,
  fetchOrderById,
  fetchDrivers,
  fetchActiveBranches,
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
    const ch = supabase
      .channel('products-changes')
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
    const ch = supabase
      .channel(`orders-changes-${branchId || 'all'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, load)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [load, branchId]);

  return { orders, loading, error, refetch: load };
}

export function useOrderTracking(orderId) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const load = async () => {
      try {
        const data = await fetchOrderById(orderId);
        setOrder(data);
      } catch (err) {
        setError(err.message || 'فشل تحميل الطلب');
      }
    };
    load();

    const ch = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        (payload) => setOrder((prev) => ({ ...prev, ...payload.new }))
      )
      .subscribe();

    return () => supabase.removeChannel(ch);
  }, [orderId]);

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
    const ch = supabase
      .channel('drivers-changes')
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
EOF

# ============================================
# src/hooks/useOrdersApi.js (نسخة محدثة)
# ============================================
cat > src/hooks/useOrdersApi.js << 'EOF'
import { createOrder as svcCreateOrder, setOrderStatus } from '../services/supabase';
import { setDriverAvailability } from '../services/supabase/drivers';
import { toggleProductStock as svcToggleStock, updateVariantPrice as svcUpdatePrice } from '../services/supabase/products';

// إعادة التصدير للتوافق مع الكود القديم
export const createOrder = svcCreateOrder;
export const updateOrderStatus = setOrderStatus;
export const toggleDriverAvailability = setDriverAvailability;
export const toggleProductStock = svcToggleStock;
export const updateVariantPrice = svcUpdatePrice;
EOF

# ============================================
# src/hooks/useCoupons.js (نسخة محدثة)
# ============================================
cat > src/hooks/useCoupons.js << 'EOF'
import { validateCoupon as svcValidateCoupon } from '../services/supabase';

// إعادة التصدير للتوافق
export const validateCoupon = svcValidateCoupon;
EOF

# ============================================
# src/hooks/useOnlineStatus.js (جديد)
# ============================================
cat > src/hooks/useOnlineStatus.js << 'EOF'
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
EOF

echo "✅ Sprint 2B: Hooks updated to use services"
echo ""
echo "الملفات المحدثة:"
ls -la src/hooks/useSupabaseData.js
ls -la src/hooks/useOrdersApi.js
ls -la src/hooks/useCoupons.js
ls -la src/hooks/useOnlineStatus.js
