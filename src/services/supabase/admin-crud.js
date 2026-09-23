import { supabase } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/errors';

// ═══ المنتجات ═══
export async function createProductFull(branchId, name, category, imageUrl, sortOrder, variants, flavors) {
  const { data, error } = await supabase.rpc('admin_create_product_full', {
    p_branch_id: branchId,
    p_name: name,
    p_category: category,
    p_image_url: imageUrl,
    p_sort_order: sortOrder || 0,
    p_variants: variants,
    p_flavors: flavors,
  });
  if (error) throw handleSupabaseError(error, 'createProduct');
  if (!data?.success) throw new Error(data?.error);
  return data;
}

export async function updateProduct(productId, updates) {
  const { error } = await supabase.from('products').update(updates).eq('id', productId);
  if (error) throw handleSupabaseError(error, 'updateProduct');
}

export async function deleteProduct(productId) {
  const { data, error } = await supabase.rpc('admin_delete_product', { p_product_id: productId });
  if (error) throw handleSupabaseError(error, 'deleteProduct');
  if (!data?.success) throw new Error(data?.error);
  return data;
}

export async function addVariant(productId, name, price, sortOrder = 0) {
  const { error } = await supabase.from('product_variants').insert({
    product_id: productId, name, price, sort_order: sortOrder,
  });
  if (error) throw handleSupabaseError(error, 'addVariant');
}

export async function updateVariant(variantId, updates) {
  const { error } = await supabase.from('product_variants').update(updates).eq('id', variantId);
  if (error) throw handleSupabaseError(error, 'updateVariant');
}

export async function deleteVariant(variantId) {
  const { error } = await supabase.from('product_variants').delete().eq('id', variantId);
  if (error) throw handleSupabaseError(error, 'deleteVariant');
}

export async function addFlavor(productId, name, extraPrice = 0, sortOrder = 0) {
  const { error } = await supabase.from('product_flavors').insert({
    product_id: productId, name, extra_price: extraPrice, sort_order: sortOrder,
  });
  if (error) throw handleSupabaseError(error, 'addFlavor');
}

export async function deleteFlavor(flavorId) {
  const { error } = await supabase.from('product_flavors').delete().eq('id', flavorId);
  if (error) throw handleSupabaseError(error, 'deleteFlavor');
}

// ═══ رفع الصور ═══
export async function uploadProductImage(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (error) throw handleSupabaseError(error, 'uploadImage');

  const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
  return data.publicUrl;
}

// ═══ الفروع ═══
export async function createBranch(branch) {
  const { data, error } = await supabase.from('branches').insert({
    name: branch.name,
    address: branch.address,
    phone: branch.phone,
    location: `POINT(${branch.lng} ${branch.lat})`,
    delivery_radius_km: branch.delivery_radius_km || 10,
    is_active: true,
  }).select().single();
  if (error) throw handleSupabaseError(error, 'createBranch');
  return data;
}

export async function updateBranch(branchId, updates) {
  const { error } = await supabase.from('branches').update(updates).eq('id', branchId);
  if (error) throw handleSupabaseError(error, 'updateBranch');
}

export async function deleteBranch(branchId) {
  const { error } = await supabase.from('branches').delete().eq('id', branchId);
  if (error) throw handleSupabaseError(error, 'deleteBranch');
}

// ═══ المناديب ═══
export async function createDriver(driver) {
  const { data, error } = await supabase.from('drivers').insert({
    branch_id: driver.branch_id,
    name: driver.name,
    phone: driver.phone,
    is_available: true,
  }).select().single();
  if (error) throw handleSupabaseError(error, 'createDriver');
  return data;
}

export async function updateDriver(driverId, updates) {
  const { error } = await supabase.from('drivers').update(updates).eq('id', driverId);
  if (error) throw handleSupabaseError(error, 'updateDriver');
}

export async function deleteDriver(driverId) {
  const { error } = await supabase.from('drivers').delete().eq('id', driverId);
  if (error) throw handleSupabaseError(error, 'deleteDriver');
}
