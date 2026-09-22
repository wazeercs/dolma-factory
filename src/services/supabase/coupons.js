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
