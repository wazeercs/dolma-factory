import { supabase } from '../lib/supabaseClient';

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
      notes: orderData.notes,
    })
    .select()
    .single();
  if (orderErr) throw orderErr;

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
  if (itemsErr) throw itemsErr;
  return order;
}

export async function updateOrderStatus(orderId, newStatus, driverId = null, driverName = null) {
  const updates = { status: newStatus };
  if (driverId) updates.driver_id = driverId;
  if (driverName) updates.driver_name = driverName;
  const { data, error } = await supabase.from('orders').update(updates).eq('id', orderId).select().single();
  if (error) throw error;
  return data;
}

export async function getNearestBranch(lat, lng) {
  const { data, error } = await supabase.rpc('get_nearest_branch', { cust_lat: lat, cust_lng: lng });
  if (error) throw error;
  return data?.[0] || null;
}

export async function toggleProductStock(productId, inStock) {
  return supabase.from('products').update({ in_stock: inStock }).eq('id', productId);
}

export async function updateVariantPrice(variantId, price) {
  return supabase.from('product_variants').update({ price }).eq('id', variantId);
}

export async function toggleDriverAvailability(driverId, isAvailable) {
  return supabase.from('drivers').update({ is_available: isAvailable }).eq('id', driverId);
}
