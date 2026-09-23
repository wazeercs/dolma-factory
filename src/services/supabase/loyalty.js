import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errors';

export async function getLoyaltyInfo(phone) {
  if (!phone) return { exists: false, points: 0, tier: 'bronze' };
  const { data, error } = await supabase.rpc('get_loyalty_info', { p_phone: phone });
  if (error) throw handleSupabaseError(error, 'loyalty');
  return data || { exists: false, points: 0, tier: 'bronze' };
}

export async function redeemPoints(phone, points) {
  const { data, error } = await supabase.rpc('redeem_loyalty_points', {
    p_phone: phone,
    p_points: points,
  });
  if (error) throw handleSupabaseError(error, 'redeem');
  if (!data?.success) throw new Error(data?.error);
  return data;
}

export async function fetchLoyaltyDashboard() {
  const { data, error } = await supabase
    .from('customer_loyalty')
    .select('*')
    .order('points', { ascending: false })
    .limit(100);
  if (error) throw handleSupabaseError(error, 'loyaltyDash');
  return data || [];
}

export const TIER_LABELS = {
  bronze: '🥉 برونزي',
  silver: '🥈 فضي',
  gold: '🥇 ذهبي',
  platinum: '💎 بلاتيني',
};

export const TIER_COLORS = {
  bronze: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  silver: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  gold: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  platinum: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};
