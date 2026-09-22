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
