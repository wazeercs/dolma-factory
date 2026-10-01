import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errors';

export const OPERATING_STATUSES = {
  OPEN: 'OPEN',
  BUSY: 'BUSY',
  VERY_BUSY: 'VERY_BUSY',
  CLOSED: 'CLOSED',
  PAUSED: 'PAUSED',
};

export async function updateBranchOperatingMode({
  branchId,
  operatingStatus,
  acceptsOrders,
  deliveryEnabled,
  pickupEnabled,
  preparationTimeMin,
  preparationTimeMax,
  minimumOrderAmount,
  productVisibilityMode,
  promotionsEnabled,
  pauseReason = null,
  resumeAt = null,
}) {
  const { data, error } = await supabase.rpc(
    'admin_update_branch_operating_mode',
    {
      p_branch_id: branchId,
      p_operating_status: operatingStatus,
      p_accepts_orders: acceptsOrders,
      p_delivery_enabled: deliveryEnabled,
      p_pickup_enabled: pickupEnabled,
      p_preparation_time_min: preparationTimeMin,
      p_preparation_time_max: preparationTimeMax,
      p_minimum_order_amount: minimumOrderAmount,
      p_product_visibility_mode: productVisibilityMode,
      p_promotions_enabled: promotionsEnabled,
      p_pause_reason: pauseReason,
      p_resume_at: resumeAt,
    }
  );

  if (error) {
    throw handleSupabaseError(error, 'branchOperatingMode');
  }

  if (!data?.success) {
    throw new Error(data?.error || 'تعذر تحديث حالة الفرع');
  }

  return data;
}
