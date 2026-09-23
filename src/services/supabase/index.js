// ═══ Barrel Export — كل خدمات Supabase ═══

// Branches
export * from './branches';

// Products
export * from './products';

// Coupons
export * from './coupons';

// Drivers
export * from './drivers';

// Orders
export * from './orders';

// Admin — CRUD
export * from './admin';
export * from './admin-crud';

// Admin — Reports
export * from './reports';

// Pagination
export * from './pagination';

// ═══ Aliases للتوافق مع الكود القديم ═══
export { setOrderStatus as updateOrderStatus } from './orders';
export { setDriverAvailability as toggleDriverAvailability } from './drivers';
export { toggleProductStock, updateVariantPrice } from './products';
