import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errors';

export async function fetchOrdersPaginated({
  branchId = null,
  onlyActive = false,
  limit = 20,
  offset = 0,
  status = null,
  search = null,
} = {}) {
  const { data, error } = await supabase.rpc('fetch_orders_paginated', {
    p_branch_id: branchId,
    p_only_active: onlyActive,
    p_limit: limit,
    p_offset: offset,
    p_status: status,
    p_search: search,
  });
  if (error) throw handleSupabaseError(error, 'pagination');
  if (!data?.success) throw new Error(data?.error || 'فشل التحميل');
  return {
    orders: data.orders || [],
    total: data.total,
    hasMore: (offset + limit) < data.total,
  };
}
