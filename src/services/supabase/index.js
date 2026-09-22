export * from './branches';
export * from './products';
export * from './coupons';
export * from './drivers';
export * from './orders';

// Aliases للتوافق مع الكود القديم
export { setOrderStatus as updateOrderStatus } from './orders';
export { setDriverAvailability as toggleDriverAvailability } from './drivers';
export { toggleProductStock } from './products';
export { updateVariantPrice } from './products';
