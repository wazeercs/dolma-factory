import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errors';

export async function fetchActiveBranches() {
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .eq('is_active', true)
    .order('name');
  if (error) throw handleSupabaseError(error, 'branches');
  return data || [];
}

export async function fetchAllBranches() {
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .order('name');
  if (error) throw handleSupabaseError(error, 'branches');
  return data || [];
}
