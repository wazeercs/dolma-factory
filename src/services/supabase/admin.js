import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errors';

export async function fetchAllProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, phone, role, branch_id, is_active, created_at')
    .order('created_at', { ascending: false });
  if (error) throw handleSupabaseError(error, 'profiles');
  return data || [];
}

export async function fetchBusinessHours(branchId) {
  const { data, error } = await supabase
    .from('branch_business_hours')
    .select('*')
    .eq('branch_id', branchId)
    .order('day_of_week');
  if (error) throw handleSupabaseError(error, 'hours');
  return data || [];
}

export async function fetchDeliveryZones(branchId) {
  const { data, error } = await supabase
    .from('delivery_zones')
    .select('*')
    .eq('branch_id', branchId)
    .order('sort_order');
  if (error) throw handleSupabaseError(error, 'zones');
  return data || [];
}

export async function updateUserRole(userId, newRole, branchId = null) {
  const { data, error } = await supabase.rpc('admin_update_user_role', {
    p_user_id: userId,
    p_new_role: newRole,
    p_branch_id: branchId,
  });
  if (error) throw handleSupabaseError(error, 'updateRole');
  if (!data?.success) throw new Error(data?.error);
  return data;
}

export async function linkDriverUser(driverId, userId) {
  const { data, error } = await supabase.rpc('admin_link_driver_user', {
    p_driver_id: driverId,
    p_user_id: userId,
  });
  if (error) throw handleSupabaseError(error, 'linkDriver');
  if (!data?.success) throw new Error(data?.error);
  return data;
}

export async function unlinkDriverUser(driverId) {
  const { data, error } = await supabase.rpc('admin_unlink_driver_user', {
    p_driver_id: driverId,
  });
  if (error) throw handleSupabaseError(error, 'unlinkDriver');
  if (!data?.success) throw new Error(data?.error);
  return data;
}

export async function updateBusinessHours(branchId, dow, isClosed, openTime, closeTime) {
  const { data, error } = await supabase.rpc('admin_update_business_hours', {
    p_branch_id: branchId,
    p_day_of_week: dow,
    p_is_closed: isClosed,
    p_open_time: openTime,
    p_close_time: closeTime,
  });
  if (error) throw handleSupabaseError(error, 'updateHours');
  if (!data?.success) throw new Error(data?.error);
  return data;
}

export async function updateDeliveryZone(zoneId, name, minKm, maxKm, fee, minOrder = 0) {
  const { data, error } = await supabase.rpc('admin_update_delivery_zone', {
    p_zone_id: zoneId,
    p_name: name,
    p_min_km: minKm,
    p_max_km: maxKm,
    p_fee: fee,
    p_min_order: minOrder,
  });
  if (error) throw handleSupabaseError(error, 'updateZone');
  if (!data?.success) throw new Error(data?.error);
  return data;
}
