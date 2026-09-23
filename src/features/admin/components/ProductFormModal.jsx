import React, { useState } from 'react';
import { useBranches } from '../../../hooks/useSupabaseData';
import { createProductFull, uploadProductImage, addVariant, addFlavor, updateProduct, deleteVariant, deleteFlavor } from '../../../services/supabase/admin-crud';
import { useToast } from '../../../components/Toast';

const CATEGORIES = ['محاشي', 'ورق عنب', 'وجبات عائلية', 'إضافات', 'مشروبات', 'حلويات', 'عروض'];

export default function ProductFormModal({ product, onClose, onSaved }) {
  const toast = useToast();
  const branches = useBranches();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || 'محاشي');
  const [branchId, setBranchId] = useState(product?.branch_id || branches[0]?.id || '');
  const [imageUrl, setImageUrl] = useState(product?.image_url || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Variants
  const [variants, setVariants] = useState(
    product?.variants?.map((v) => ({ id: v.id, name: v.name, price: v.price })) ||
    [{ name: '', price: 0 }]
  );

  // Flavors
  const [flavors, setFlavors] = useState(
    product?.flavors?.map((f) => ({ id: f.id, name: f.name, extra_price: f.extra_price || 0 })) ||
    []
  );

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة أكبر من 5 ميجا');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setImageUrl(url);
      toast.success('تم رفع الصورة');
    } catch (err) {
      toast.error(err.message || 'فشل الرفع');
    } finally {
      setUploading(false);
    }
  };

  const updateVariant = (i, field, value) => {
    const v = [...variants];
    v[i] = { ...v[i], [field]: value };
    setVariants(v);
  };

  const removeVariant = async (i) => {
    const v = variants[i];
    if (v.id) {
      try { await deleteVariant(v.id); } catch {}
    }
    setVariants(variants.filter((_, idx) => idx !== i));
  };

  const updateFlavor = (i, field, value) => {
    const f = [...flavors];
    f[i] = { ...f[i], [field]: value };
    setFlavors(f);
  };

  const removeFlavor = async (i) => {
    const f = flavors[i];
    if (f.id) {
      try { await deleteFlavor(f.id); } catch {}
    }
    setFlavors(flavors.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    if (!name.trim()) return toast.warning('يرجى إدخال اسم المنتج');
    if (!branchId) return toast.warning('يرجى اختيار الفرع');
    if (variants.length === 0 || !variants[0].name) return toast.warning('أضف على الأقل حجم واحد');
    if (!imageUrl) return toast.warning('يرجى رفع صورة المنتج');

    setSaving(true);
    try {
      if (isEdit) {
        // تحديث
        await updateProduct(product.id, {
          name: name.trim(),
          category,
          image_url: imageUrl,
        });
        // إضافة variants/flavors الجديدة فقط (التي ليس لها id)
        for (const v of variants) {
          if (!v.id && v.name) await addVariant(product.id, v.name, v.price);
        }
        for (const f of flavors) {
          if (!f.id && f.name) await addFlavor(product.id, f.name, f.extra_price || 0);
        }
        toast.success('تم التحديث ✅');
      } else {
        // إنشاء جديد
        await createProductFull(
          branchId,
          name.trim(),
          category,
          imageUrl,
          0,
          variants.filter((v) => v.name).map((v) => ({ name: v.name, price: Number(v.price) || 0 })),
          flavors.filter((f) => f.name).map((f) => ({ name: f.name, extra_price: Number(f.extra_price) || 0 }))
        );
        toast.success('تم إضافة المنتج ✅');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message || 'فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/70 flex items-end justify-center overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-t-3xl max-h-[95vh] flex flex-col">
        <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-800 dark:text-white">
            {isEdit ? '✏️ تعديل منتج' : '➕ إضافة منتج جديد'}
          </h2>
          <button onClick={onClose} className="text-2xl text-gray-700 dark:text-gray-200">✕</button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* الاسم */}
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-200 text-sm mb-2">اسم المنتج *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: ورق عنب"
              className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-teal-600 outline-none"
            />
          </div>

          {/* القسم */}
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-200 text-sm mb-2">القسم</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* الفرع (إنشاء فقط) */}
          {!isEdit && (
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-200 text-sm mb-2">الفرع *</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value="">اختر الفرع</option>
                {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          )}

          {/* الصورة */}
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-200 text-sm mb-2">صورة المنتج *</label>
            <div className="flex gap-3 items-start">
              {imageUrl && (
                <img src={imageUrl} alt="" className="w-20 h-20 rounded-lg object-cover" />
              )}
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <div className="w-full p-4 border-2 border-dashed border-teal-400 rounded-xl text-center text-teal-700 dark:text-teal-400 font-bold text-sm">
                  {uploading ? '⏳ جاري الرفع...' : imageUrl ? '🔄 تغيير الصورة' : '📷 اختر صورة'}
                </div>
              </label>
            </div>
          </div>

          {/* الأحجام */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-bold text-gray-700 dark:text-gray-200 text-sm">الأحجام والأسعار *</label>
              <button
                onClick={() => setVariants([...variants, { name: '', price: 0 }])}
                className="text-xs bg-teal-700 text-white px-3 py-1 rounded-lg font-bold"
              >
                + إضافة
              </button>
            </div>
            <div className="space-y-2">
              {variants.map((v, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="الحجم (مثال: 12 حبة)"
                    value={v.name}
                    onChange={(e) => updateVariant(i, 'name', e.target.value)}
                    className="flex-1 p-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                  />
                  <input
                    type="number"
                    placeholder="السعر"
                    value={v.price}
                    onChange={(e) => updateVariant(i, 'price', parseFloat(e.target.value) || 0)}
                    className="w-24 p-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                  />
                  <span className="text-xs">SR</span>
                  {variants.length > 1 && (
                    <button onClick={() => removeVariant(i)} className="text-red-500 text-sm font-bold">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* النكهات */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-bold text-gray-700 dark:text-gray-200 text-sm">النكهات (اختياري)</label>
              <button
                onClick={() => setFlavors([...flavors, { name: '', extra_price: 0 }])}
                className="text-xs bg-teal-700 text-white px-3 py-1 rounded-lg font-bold"
              >
                + إضافة
              </button>
            </div>
            {flavors.length > 0 && (
              <div className="space-y-2">
                {flavors.map((f, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="النكهة (مثال: سبايسي)"
                      value={f.name}
                      onChange={(e) => updateFlavor(i, 'name', e.target.value)}
                      className="flex-1 p-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                    />
                    <input
                      type="number"
                      placeholder="+ سعر"
                      value={f.extra_price}
                      onChange={(e) => updateFlavor(i, 'extra_price', parseFloat(e.target.value) || 0)}
                      className="w-24 p-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                    />
                    <span className="text-xs">SR</span>
                    <button onClick={() => removeFlavor(i)} className="text-red-500 text-sm font-bold">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t dark:border-gray-700">
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="w-full bg-teal-700 text-white py-4 rounded-xl font-black text-lg shadow-lg disabled:opacity-50"
          >
            {saving ? '⏳ جاري الحفظ...' : isEdit ? '💾 حفظ التعديلات' : '➕ إضافة المنتج'}
          </button>
        </div>
      </div>
    </div>
  );
}
