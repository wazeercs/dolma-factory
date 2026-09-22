export const ROLES = {
  CUSTOMER: 'customer',
  CASHIER: 'cashier',
  BRANCH_MANAGER: 'branch_manager',
  DRIVER: 'driver',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

export const ROLE_LABELS = {
  customer: 'زبون',
  cashier: 'كاشير',
  branch_manager: 'مدير فرع',
  driver: 'مندوب',
  admin: 'إدارة',
  super_admin: 'إدارة عليا',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY_FOR_DELIVERY: 'ready_for_delivery',
  ASSIGNED: 'assigned',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
};

export const ORDER_STATUS_LABELS = {
  pending: 'بانتظار التأكيد',
  confirmed: 'مؤكد',
  preparing: 'قيد التحضير',
  ready_for_delivery: 'جاهز للتوصيل',
  assigned: 'مسند لمندوب',
  out_for_delivery: 'في الطريق',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
  rejected: 'مرفوض',
};

export const ALLOWED_TRANSITIONS = {
  pending: ['confirmed', 'rejected', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready_for_delivery', 'cancelled'],
  ready_for_delivery: ['assigned', 'cancelled'],
  assigned: ['out_for_delivery', 'ready_for_delivery'],
  out_for_delivery: ['delivered', 'ready_for_delivery'],
  delivered: [],
  cancelled: [],
  rejected: [],
};

export const CONNECTION_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  RECONNECTING: 'reconnecting',
  SUBSCRIBED: 'subscribed',
  CHANNEL_ERROR: 'channel_error',
  TIMED_OUT: 'timed_out',
  CLOSED: 'closed',
};
