import React, { useEffect, useState } from 'react';
import { updateBranchOperatingMode } from '../../../services/supabase/branch-operating-mode';
import { useToast } from '../../../components/Toast';

const STATUS_OPTIONS = [
  ['OPEN', 'مفتوح'],
  ['BUSY', 'مشغول'],
  ['VERY_BUSY', 'مشغول جدًا'],
  ['CLOSED', 'مغلق'],
  ['PAUSED', 'متوقف مؤقتًا'],
];

export default function BranchStatusTab({ branches = [] }) {
  const toast = useToast();
  const [branchId, setBranchId] = useState(branches[0]?.id || '');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    operatingStatus: 'OPEN',
    acceptsOrders: true,
    deliveryEnabled: true,
    pickupEnabled: true,
    preparationTimeMin: 15,
    preparationTimeMax: 30,
    minimumOrderAmount: 0,
    productVisibilityMode: 'ALL',
    promotionsEnabled: true,
    pauseReason: '',
    resumeAt: '',
  });

  const branch = branches.find((item) => item.id === branchId);

  useEffect(() => {
    if (!branch) return;

    setForm({
      operatingStatus: branch.operating_status || 'OPEN',
      acceptsOrders: branch.accepts_orders ?? true,
      deliveryEnabled: branch.delivery_enabled ?? true,
      pickupEnabled: branch.pickup_enabled ?? true,
      preparationTimeMin: branch.preparation_time_min ?? 15,
      preparationTimeMax: branch.preparation_time_max ?? 30,
      minimumOrderAmount: branch.minimum_order_amount ?? 0,
      productVisibilityMode: branch.product_visibility_mode || 'ALL',
      promotionsEnabled: branch.promotions_enabled ?? true,
      pauseReason: branch.pause_reason || '',
      resumeAt: branch.resume_at
        ? new Date(branch.resume_at).toISOString().slice(0, 16)
        : '',
    });
  }, [branch]);

  useEffect(() => {
    if (!branchId && branches[0]?.id) {
      setBranchId(branches[0].id);
    }
  }, [branches, branchId]);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = async () => {
    if (!branchId) return toast.warning('اختر الفرع أولاً');

    const min = Number(form.preparationTimeMin);
    const max = Number(form.preparationTimeMax);
    const minimum = Number(form.minimumOrderAmount);

    if (
      !Number.isFinite(min) ||
      !Number.isFinite(max) ||
      min < 0 ||
      max < min
    ) {
      return toast.warning('وقت التجهيز غير صحيح');
    }

    if (!Number.isFinite(minimum) || minimum < 0) {
      return toast.warning('الحد الأدنى للطلب غير صحيح');
    }

    setSaving(true);

    try {
      await updateBranchOperatingMode({
        branchId,
        operatingStatus: form.operatingStatus,
        acceptsOrders: form.acceptsOrders,
        deliveryEnabled: form.deliveryEnabled,
        pickupEnabled: form.pickupEnabled,
        preparationTimeMin: min,
        preparationTimeMax: max,
        minimumOrderAmount: minimum,
        productVisibilityMode: form.productVisibilityMode,
        promotionsEnabled: form.promotionsEnabled,
        pauseReason: form.pauseReason || null,
        resumeAt: form.resumeAt
          ? new Date(form.resumeAt).toISOString()
          : null,
      });

      toast.success('تم تحديث حالة الفرع');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'فشل تحديث حالة الفرع');
    } finally {
      setSaving(false);
    }
  };

  if (!branches.length) {
    return (
      <div className="p-4 rounded-2xl bg-yellow-50 text-yellow-800">
        لا توجد فروع متاحة.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
        <h2 className="text-xl font-black mb-4">حالة تشغيل الفروع</h2>

        <label className="block text-sm font-bold mb-2">الفرع</label>
        <select
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
          className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700 mb-4"
        >
          {branches.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <label className="block text-sm font-bold mb-2">حالة المطعم</label>
        <select
          value={form.operatingStatus}
          onChange={(e) => update('operatingStatus', e.target.value)}
          className="w-full p-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700"
        >
          {STATUS_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ['acceptsOrders', 'استقبال الطلبات'],
          ['deliveryEnabled', 'التوصيل'],
          ['pickupEnabled', 'الاستلام من الفرع'],
          ['promotionsEnabled', 'ظهور العروض'],
        ].map(([key, label]) => (
          <label
            key={key}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-center justify-between"
          >
            <span className="font-bold">{label}</span>
            <input
              type="checkbox"
              checked={form[key]}
              onChange={(e) => update(key, e.target.checked)}
              className="w-5 h-5"
            />
          </label>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
        <h3 className="font-black mb-4">وقت التجهيز</h3>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            من بالدقائق
            <input
              type="number"
              min="0"
              value={form.preparationTimeMin}
              onChange={(e) => update('preparationTimeMin', e.target.value)}
              className="w-full mt-1 p-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700"
            />
          </label>

          <label className="text-sm">
            إلى بالدقائق
            <input
              type="number"
              min="0"
              value={form.preparationTimeMax}
              onChange={(e) => update('preparationTimeMax', e.target.value)}
              className="w-full mt-1 p-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700"
            />
          </label>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm space-y-4">
        <h3 className="font-black">التحكم في الطلبات والقائمة</h3>

        <label className="block text-sm font-bold">
          الحد الأدنى للطلب
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.minimumOrderAmount}
            onChange={(e) => update('minimumOrderAmount', e.target.value)}
            className="w-full mt-1 p-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700"
          />
        </label>

        <label className="block text-sm font-bold">
          المنتجات المتاحة
          <select
            value={form.productVisibilityMode}
            onChange={(e) => update('productVisibilityMode', e.target.value)}
            className="w-full mt-1 p-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700"
          >
            <option value="ALL">كل المنتجات</option>
            <option value="IN_STOCK_ONLY">المتوفر فقط</option>
          </select>
        </label>

        <label className="block text-sm font-bold">
          سبب الإيقاف
          <input
            type="text"
            value={form.pauseReason}
            onChange={(e) => update('pauseReason', e.target.value)}
            placeholder="مثال: ضغط طلبات"
            className="w-full mt-1 p-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700"
          />
        </label>

        <label className="block text-sm font-bold">
          موعد العودة المتوقع
          <input
            type="datetime-local"
            value={form.resumeAt}
            onChange={(e) => update('resumeAt', e.target.value)}
            className="w-full mt-1 p-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="w-full bg-teal-700 disabled:opacity-50 text-white p-4 rounded-2xl font-black"
      >
        {saving ? 'جارٍ الحفظ...' : 'حفظ إعدادات الفرع'}
      </button>
    </div>
  );
}
