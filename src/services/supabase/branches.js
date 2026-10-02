import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errors';

export async function fetchActiveBranches() {
  const { data, error } = await supabase
    .from('branches')
    .select(`
      id,
      name,
      address,
      phone,
      location,
      delivery_radius_km,
      is_active,
      accepts_orders,
      delivery_enabled,
      pickup_enabled,
      minimum_order_amount,
      product_visibility_mode,
      pause_reason,
      operating_status,
      preparation_time_min,
      preparation_time_max,
      promotions_enabled,
      resume_at
    `)
    .eq('is_active', true)
    .order('name');
  if (error) throw handleSupabaseError(error, 'branches');
  return data || [];
}

export async function fetchAllBranches() {
  const { data, error } = await supabase
    .from('branches')
    .select(`
      id,
      name,
      address,
      phone,
      location,
      delivery_radius_km,
      is_active,
      accepts_orders,
      delivery_enabled,
      pickup_enabled,
      minimum_order_amount,
      product_visibility_mode,
      pause_reason,
      operating_status,
      preparation_time_min,
      preparation_time_max,
      promotions_enabled,
      resume_at
    `)
    .order('name');
  if (error) throw handleSupabaseError(error, 'branches');
  return data || [];
}
