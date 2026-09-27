import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errors';

export async function fetchOrders({ branchId = null, onlyActive = false } = {}) {
  let query = supabase.from('orders').select('*, order_items (*)')
    .order('created_at', { ascending: false });
  if (branchId) query = query.eq('branch_id', branchId);
  if (onlyActive) query = query.not('status', 'in', '("delivered","cancelled","rejected")');
  const { data, error } = await query;
  if (error) throw handleSupabaseError(error, 'orders');
  return data || [];
}


export async function fetchDriverOrders(driverId, { onlyActive = false } = {}) {
  if (!driverId) return [];

  let query = supabase
    .from('orders')
    .select(`
      id,
      order_number,
      customer_name,
      customer_phone,
      order_type,
      delivery_address,
      delivery_location,
      total,
      status,
      created_at,
      order_items (
        id,
        product_name,
        variant_name,
        flavor_name,
        quantity
      )
    `)
    .eq('driver_id', driverId)
    .order('created_at', { ascending: false });

  if (onlyActive) {
    query = query.not(
      'status',
      'in',
      '("delivered","cancelled","rejected")'
    );
  }

  const { data, error } = await query;

  if (error) {
    throw handleSupabaseError(error, 'driverOrders');
  }

  return data || [];
}

export async function fetchDriverCompletedToday(driverId, startIso) {
  if (!driverId || !startIso) return [];

  const { data, error } = await supabase
    .from('orders')
    .select('id')
    .eq('driver_id', driverId)
    .eq('status', 'delivered')
    .gte('created_at', startIso);

  if (error) {
    throw handleSupabaseError(error, 'driverCompletedToday');
  }

  return data || [];
}

export async function fetchOrderById(orderId) {
  const { data, error } = await supabase.from('orders')
    .select('*, order_items (*)').eq('id', orderId).single();
  if (error) throw handleSupabaseError(error, 'order');
  return data;
}

export async function createOrder(orderData, cartItems) {
  const cart = cartItems.map((item) => ({
    product_id: item.productId,
    variant_id: item.variantId || item.variant_id,
    flavor_id: item.flavorId || item.flavor_id || null,
    quantity: item.quantity,
  }));

  const loyaltyPoints = Number(orderData.loyaltyPoints || 0);

  const rpcName =
    loyaltyPoints > 0
      ? 'create_order_secure_with_loyalty'
      : 'create_order_secure';

  const rpcArgs = {
    p_branch_id: orderData.branchId,
    p_customer_name: orderData.customerName,
    p_customer_phone: orderData.customerPhone,
    p_order_type: orderData.orderType,
    p_delivery_address: orderData.deliveryAddress || null,
    p_delivery_notes: orderData.deliveryNotes || null,
    p_delivery_lat: orderData.deliveryLocation?.lat || null,
    p_delivery_lng: orderData.deliveryLocation?.lng || null,
    p_payment_method: orderData.paymentMethod || 'cash',
    p_coupon_code: orderData.couponCode || null,
    p_idempotency_key: orderData.idempotencyKey || null,
    p_notes: orderData.notes || null,
    p_cart: cart,
  };

  if (loyaltyPoints > 0) {
    rpcArgs.p_loyalty_points = loyaltyPoints;
  }

  const { data, error } = await supabase.rpc(rpcName, rpcArgs);

  if (error) throw handleSupabaseError(error, 'createOrder');
  if (!data?.success) throw new Error(data?.error || 'فشل إنشاء الطلب');

  return {
    id: data.order_id,
    order_number: data.order_number,
    subtotal: data.subtotal,
    delivery_fee: data.delivery_fee,
    discount: data.discount,
    total: data.total,
    distance_km: data.distance_km,
    duplicate: data.duplicate || false,
  };
}

export async function setOrderStatus(orderId, newStatus, driverId = null, driverName = null, reason = null) {
  const { data, error } = await supabase.rpc('transition_order_status', {
    p_order_id: orderId,
    p_new_status: newStatus,
    p_driver_id: driverId || null,
    p_reason: reason || null,
  });
  if (error) throw handleSupabaseError(error, 'setOrderStatus');
  if (!data?.success) throw new Error(data?.error || 'فشل تحديث الحالة');
  return data;
}



export async function toggleProductStock(productId, inStock) {
  const { error } = await supabase.from('products')
    .update({ in_stock: inStock }).eq('id', productId);
  if (error) throw handleSupabaseError(error, 'toggleStock');
}

export async function updateVariantPrice(variantId, price) {
  const { error } = await supabase.from('product_variants')
    .update({ price: Number(price) }).eq('id', variantId);
  if (error) throw handleSupabaseError(error, 'updatePrice');
}

export async function trackOrder(orderNumber, phone) {
  const { data, error } = await supabase.rpc('track_order', {
    p_order_number: orderNumber,
    p_phone: phone,
  });
  if (error) throw handleSupabaseError(error, 'trackOrder');
  if (!data?.success) throw new Error(data?.error || 'لم يتم العثور على الطلب');
  return data.order;
}
