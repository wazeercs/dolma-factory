import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errors';

export async function searchProducts(branchId, query = null, category = null) {
  const { data, error } = await supabase.rpc('search_products', {
    p_branch_id: branchId,
    p_query: query,
    p_category: category,
  });
  if (error) throw handleSupabaseError(error, 'search');
  if (!data?.success) throw new Error(data?.error || 'فشل البحث');
  return data.products || [];
}

export async function fetchReportSummaryV2(from, to, branchId = null) {
  const { data, error } = await supabase.rpc('report_summary_v2', {
    p_from: from.toISOString(),
    p_to: to.toISOString(),
    p_branch_id: branchId,
  });
  if (error) throw handleSupabaseError(error, 'reportV2');
  if (!data?.success) throw new Error(data?.error);
  return data;
}
