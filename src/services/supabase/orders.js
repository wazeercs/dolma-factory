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
