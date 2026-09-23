import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errors';

export async function fetchReportSummary(from, to, branchId = null) {
  const { data, error } = await supabase.rpc('report_summary', {
    p_from: from.toISOString(),
    p_to: to.toISOString(),
    p_branch_id: branchId,
  });
  if (error) throw handleSupabaseError(error, 'reportSummary');
  if (!data?.success) throw new Error(data?.error || 'فشل التقرير');
  return data;
}

export async function fetchTopProducts(from, to, limit = 10) {
  const { data, error } = await supabase.rpc('report_top_products', {
    p_from: from.toISOString(),
    p_to: to.toISOString(),
    p_limit: limit,
  });
  if (error) throw handleSupabaseError(error, 'topProducts');
  return data?.products || [];
}

export async function fetchCampaigns() {
  const { data, error } = await supabase
    .from('menu_campaigns')
    .select('*')
    .order('start_date', { ascending: false });
  if (error) throw handleSupabaseError(error, 'campaigns');
  return data || [];
}

export async function createCampaign(campaign) {
  const { data, error } = await supabase
    .from('menu_campaigns')
    .insert(campaign)
    .select()
    .single();
  if (error) throw handleSupabaseError(error, 'createCampaign');
  return data;
}

export async function deleteCampaign(id) {
  const { error } = await supabase.from('menu_campaigns').delete().eq('id', id);
  if (error) throw handleSupabaseError(error, 'deleteCampaign');
}
