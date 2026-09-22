import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errors';

export async function fetchProducts(branchId = null) {
  let query = supabase
    .from('products')
    .select(`
      id, name, category, image_url, in_stock, sort_order,
      product_flavors (id, name, extra_price, sort_order),
      product_variants (id, name, price, sort_order)
    `)
    .order('sort_order');

  if (branchId) query = query.eq('branch_id', branchId);

  const { data, error } = await query;
  if (error) throw handleSupabaseError(error, 'products');

  return (data || []).map((p) => ({
    ...p,
    flavors: (p.product_flavors || []).sort((a, b) => a.sort_order - b.sort_order),
    variants: (p.product_variants || []).sort((a, b) => a.sort_order - b.sort_order),
  }));
}

export async function toggleProductStock(productId, inStock) {
  const { error } = await supabase
    .from('products')
    .update({ in_stock: inStock })
    .eq('id', productId);
  if (error) throw handleSupabaseError(error, 'toggleStock');
}

export async function updateVariantPrice(variantId, price) {
  const { error } = await supabase
    .from('product_variants')
    .update({ price: Number(price) })
    .eq('id', variantId);
  if (error) throw handleSupabaseError(error, 'updatePrice');
}
