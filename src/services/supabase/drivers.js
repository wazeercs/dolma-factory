import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errors';

export async function fetchDrivers(branchId = null) {
  let q = supabase.from('drivers').select('*');
  if (branchId) q = q.eq('branch_id', branchId);
  const { data, error } = await q.order('name');
  if (error) throw handleSupabaseError(error, 'drivers');
  return data || [];
}

export async function setDriverAvailability(driverId, isAvailable) {
  const { error } = await supabase
    .from('drivers')
    .update({ is_available: isAvailable })
    .eq('id', driverId);
  if (error) throw handleSupabaseError(error, 'driverAvailability');
}
