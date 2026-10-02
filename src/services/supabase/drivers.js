import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errors';

export async function fetchDrivers(branchId = null) {
  let q = supabase.from('drivers').select(`
    id,
    name,
    phone,
    branch_id,
    user_id,
    is_available
  `);
  if (branchId) q = q.eq('branch_id', branchId);
  const { data, error } = await q.order('name');
  if (error) throw handleSupabaseError(error, 'drivers');
  return data || [];
}

export async function setDriverAvailability(driverId, isAvailable) {
  const { error } = await supabase.rpc('set_driver_availability', {
    p_driver_id: driverId,
    p_is_available: isAvailable,
  });

  if (error) throw handleSupabaseError(error, 'driverAvailability');
}
