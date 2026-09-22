#!/data/data/com.termux/files/usr/bin/bash
set -e

mkdir -p src/services/supabase

# ============================================
# src/services/supabase/branches.js
# ============================================
cat > src/services/supabase/branches.js << 'EOF'
import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errors';

export async function fetchActiveBranches() {
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .eq('is_active', true)
    .order('name');
  if (error) throw handleSupabaseError(error, 'branches');
  return data || [];
}

export async function fetchAllBranches() {
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .order('name');
  if (error) throw handleSupabaseError(error, 'branches');
  return data || [];
}
EOF

# ============================================
# src/services/supabase/products.js
# ============================================
cat > src/services/supabase/products.js << 'EOF'
import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errors';

export async function fetchProducts(branchId = null) {
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
  if (error) throw handleSupabaseError(error, 'products');

  return (data || []).map((p) => ({
    ...p,
    flavors: (p.product_flavors || []).sort((a, b) => a.sort_order - b.sort_order),
    variants: (p.product_variants || []).sort((a, b) => a.sort_order - b.sort_order),
  }));
}

export async function toggleProductStock(productId, inStock) {
  const { error } = await supabase
    .from('products')
    .update({ in_stock: inStock })
    .eq('id', productId);
  if (error) throw handleSupabaseError(error, 'toggleStock');
}

export async function updateVariantPrice(variantId, price) {
  const { error } = await supabase
    .from('product_variants')
    .update({ price: Number(price) })
    .eq('id', variantId);
  if (error) throw handleSupabaseError(error, 'updatePrice');
}
EOF

# ============================================
# src/services/supabase/coupons.js
# ============================================
cat > src/services/supabase/coupons.js << 'EOF'
import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errors';

export async function validateCoupon(code, subtotal, branchId = null) {
  const { data, error } = await supabase.rpc('validate_coupon', {
    p_code: code.trim(),
    p_subtotal: subtotal,
    p_branch_id: branchId,
  });
  if (error) throw handleSupabaseError(error, 'coupon');
  const r = data?.[0];
  return {
    valid: r?.valid || false,
    couponId: r?.coupon_id || null,
    discountAmount: Number(r?.discount_amount || 0),
    message: r?.message || 'خطأ غير معروف',
  };
}
EOF

# ============================================
# src/services/supabase/drivers.js
# ============================================
cat > src/services/supabase/drivers.js << 'EOF'
import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errors';

export async function fetchDrivers(branchId = null) {
  let q = supabase.from('drivers').select('*');
  if (branchId) q = q.eq('branch_id', branchId);
  const { data, error } = await q.order('name');
  if (error) throw handleSupabaseError(error, 'drivers');
  return data || [];
}

export async function setDriverAvailability(driverId, isAvailable) {
  const { error } = await supabase
    .from('drivers')
    .update({ is_available: isAvailable })
    .eq('id', driverId);
  if (error) throw handleSupabaseError(error, 'driverAvailability');
}
EOF

# ============================================
# src/services/supabase/orders.js
# ============================================
cat > src/services/supabase/orders.js << 'EOF'
import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errors';

export async function fetchOrders({ branchId = null, onlyActive = false } = {}) {
  let query = supabase
    .from('orders')
    .select('*, order_items (*)')
    .order('created_at', { ascending: false });

  if (branchId) query = query.eq('branch_id', branchId);
  if (onlyActive) query = query.not('status', 'in', '("delivered","cancelled","rejected")');

  const { data, error } = await query;
  if (error) throw handleSupabaseError(error, 'orders');
  return data || [];
}

export async function fetchOrderById(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items (*)')
    .eq('id', orderId)
    .single();
  if (error) throw handleSupabaseError(error, 'order');
  return data;
}

export async function createOrder(orderData, cartItems) {
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      branch_id: orderData.branchId,
      customer_name: orderData.customerName,
      customer_phone: orderData.customerPhone,
      order_type: orderData.orderType,
      delivery_location: orderData.deliveryLocation
        ? `POINT(${orderData.deliveryLocation.lng} ${orderData.deliveryLocation.lat})`
        : null,
      delivery_address: orderData.deliveryAddress,
      distance_km: orderData.distanceKm,
      subtotal: orderData.subtotal,
      delivery_fee: orderData.deliveryFee,
      discount: orderData.discount || 0,
      total: orderData.total,
      payment_method: orderData.paymentMethod,
      idempotency_key: orderData.idempotencyKey,
      coupon_id: orderData.couponId || null,
      coupon_code: orderData.couponCode || null,
    })
    .select()
    .single();

  if (orderErr) throw handleSupabaseError(orderErr, 'createOrder');

  const items = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    flavor_name: item.flavorName,
    variant_name: item.variantName,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.unitPrice * item.quantity,
  }));

  const { error: itemsErr } = await supabase.from('order_items').insert(items);
  if (itemsErr) throw handleSupabaseError(itemsErr, 'createOrderItems');

  return order;
}

export async function setOrderStatus(orderId, newStatus, driverId = null, driverName = null) {
  const updates = { status: newStatus };
  if (driverId) updates.driver_id = driverId;
  if (driverName) updates.driver_name = driverName;

  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw handleSupabaseError(error, 'setOrderStatus');
  return data;
}
EOF

# ============================================
# src/services/supabase/index.js (barrel)
# ============================================
cat > src/services/supabase/index.js << 'EOF'
export * from './branches';
export * from './products';
export * from './coupons';
export * from './drivers';
export * from './orders';
EOF

# ============================================
# src/lib/validation.js
# ============================================
cat > src/lib/validation.js << 'EOF'
export function validateSaudiPhone(phone) {
  if (!phone) return false;
  const cleaned = String(phone).replace(/\s|-/g, '');
  return /^(?:\+9665|9665|05|5)\d{8}$/.test(cleaned);
}

export function validateCustomerName(name) {
  if (!name) return false;
  const trimmed = String(name).trim();
  return trimmed.length >= 2 && trimmed.length <= 50;
}

export function validateOrderPayload(order) {
  const errors = [];

  if (!order.branchId) errors.push('الفرع مطلوب');
  if (!validateCustomerName(order.customerName)) errors.push('الاسم غير صالح');
  if (!validateSaudiPhone(order.customerPhone)) errors.push('رقم الجوال غير صالح');
  if (!['delivery', 'pickup'].includes(order.orderType)) errors.push('نوع الطلب غير صالح');
  if (!['cash', 'card', 'apple_pay', 'stc_pay'].includes(order.paymentMethod))
    errors.push('طريقة الدفع غير صالحة');

  if (Number(order.subtotal) < 0) errors.push('المجموع الفرعي غير صالح');
  if (Number(order.total) < 0) errors.push('الإجمالي غير صالح');

  return { valid: errors.length === 0, errors };
}

export function validateCart(cart) {
  if (!Array.isArray(cart) || cart.length === 0) {
    return { valid: false, errors: ['السلة فارغة'] };
  }
  for (const item of cart) {
    if (!item.productId) return { valid: false, errors: ['منتج غير معرف'] };
    if (!item.quantity || item.quantity < 1) return { valid: false, errors: ['كمية غير صالحة'] };
    if (item.unitPrice == null || item.unitPrice < 0)
      return { valid: false, errors: ['سعر غير صالح'] };
  }
  return { valid: true, errors: [] };
}
EOF

echo "✅ Sprint 2A: Services + Validation created"
ls -la src/services/supabase/
ls -la src/lib/validation.js
