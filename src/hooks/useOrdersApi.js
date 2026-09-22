import { createOrder as svcCreateOrder, setOrderStatus } from '../services/supabase';
import { setDriverAvailability } from '../services/supabase/drivers';
import { toggleProductStock as svcToggleStock, updateVariantPrice as svcUpdatePrice } from '../services/supabase/products';

// إعادة التصدير للتوافق مع الكود القديم
export const createOrder = svcCreateOrder;
export const updateOrderStatus = setOrderStatus;
export const toggleDriverAvailability = setDriverAvailability;
export const toggleProductStock = svcToggleStock;
export const updateVariantPrice = svcUpdatePrice;
