import React, { useState } from 'react';
import { createBranch, updateBranch, deleteBranch } from '../../../services/supabase/admin-crud';
import { useToast } from '../../../components/Toast';

export default function BranchesTab({ branches }) {
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editBranch, setEditBranch] = useState(null);
  const [form, setForm] = useState({ name: '', address: '', phone: '', lat: 24.7136, lng: 46.6753, delivery_radius_km: 10 });

  const openAdd = () => {
    setEditBranch(null);
    setForm({ name: '', address: '', phone: '', lat: 24.7136, lng: 46.6753, delivery_radius_km: 10 });
    setShowForm(true);
  };

  const openEdit = (b) => {
    setEditBranch(b);
    setForm({
      name: b.name,
      address: b.address || '',
      phone: b.phone || '',
      lat: b.location?.coordinates?.[1] || 24.7136,
      lng: b.location?.coordinates?.[0] || 46.6753,
      delivery_radius_km: b.delivery_radius_km || 10,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.warning('يرجى إدخال اسم الفرع');
    try {
      if (editBranch) {
        await updateBranch(editBranch.id, {
          name: form.name,
          address: form.address,
          phone: form.phone,
          delivery_radius_km: parseFloat(form.delivery_radius_km),
        });
        toast.success('تم التحديث');
      } else {
        await createBranch({
          name: form.name,
          address: form.address,
          phone: form.phone,
          lat: parseFloat(form.lat),
          lng: parseFloat(form.lng),
          delivery_radius_km: parseFloat(form.delivery_radius_km),
        });
        toast.success('تم الإضافة');
      }
      setShowForm(false);
      window.location.reload();
    } catch (e) {
      toast.error(e.message || 'فشل الحفظ');
    }
  };

  const handleDelete = async (b) => {
    if (!window.confirm(`حذف "${b.name}"؟ سيتم حذف جميع المنتجات والطلبات المرتبطة.`)) return;
    try {
      await deleteBranch(b.id);
      toast.success('تم الحذف');
      window.location.reload();
    } catch (e) {
      toast.error(e.message || 'فشل الحذف');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-black text-gray-800 dark:text-white">🏬 الفروع ({branches.length})</h2>
        <button onClick={openAdd} className="bg-teal-700 text-white px-4 py-2 rounded-xl font-bold text-sm">
          ➕ إضافة فرع
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {branches.map((b) => (
          <div key={b.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border-r-4 border-green-500">
            <h3 className="font-black text-lg text-gray-800 dark:text-white">{b.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{b.address}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">📏 نطاق: {b.delivery_radius_km} كم</p>
            <p className="text-sm text-gray-500 dark:text-gray-400" dir="ltr">📞 {b.phone}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => openEdit(b)} className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-3 py-1.5 rounded-lg text-xs font-bold">✏️ تعديل</button>
              <button onClick={() => handleDelete(b)} className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 px-3 py-1.5 rounded-lg text-xs font-bold">🗑️ حذف</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[80] bg-black/70 flex items-end justify-center">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-t-3xl p-5 space-y-3">
            <h2 className="text-xl font-black text-gray-800 dark:text-white">
              {editBranch ? '✏️ تعديل فرع' : '➕ إضافة فرع'}
            </h2>

            {['name', 'address', 'phone'].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field === 'name' ? 'اسم الفرع *' : field === 'address' ? 'العنوان' : 'رقم الهاتف'}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            ))}

            {!editBranch && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number" step="0.0001"
                  placeholder="Latitude"
                  value={form.lat}
                  onChange={(e) => setForm({ ...form, lat: e.target.value })}
                  className="p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
                <input
                  type="number" step="0.0001"
                  placeholder="Longitude"
                  value={form.lng}
                  onChange={(e) => setForm({ ...form, lng: e.target.value })}
                  className="p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>
            )}

            <input
              type="number"
              placeholder="نطاق التوصيل (كم)"
              value={form.delivery_radius_km}
              onChange={(e) => setForm({ ...form, delivery_radius_km: e.target.value })}
              className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />

            <div className="flex gap-2 pt-2">
              <button onClick={handleSave} className="flex-1 bg-teal-700 text-white py-3 rounded-xl font-black">حفظ</button>
              <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-bold">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
