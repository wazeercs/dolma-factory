import React, { useState } from 'react';
import { useDrivers, useBranches } from '../../../hooks/useSupabaseData';
import { createDriver, updateDriver, deleteDriver } from '../../../services/supabase/admin-crud';
import { fetchAllProfiles, linkDriverUser, unlinkDriverUser } from '../../../services/supabase/admin';
import { useToast } from '../../../components/Toast';
import { useEffect } from 'react';

export default function DriversTab() {
  const toast = useToast();
  const branches = useBranches();
  const { drivers, refetch } = useDrivers();
  const [profiles, setProfiles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editDriver, setEditDriver] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', branch_id: '' });
  const [linking, setLinking] = useState(null);

  useEffect(() => {
    fetchAllProfiles()
      .then((data) => setProfiles(data.filter((p) => p.role === 'driver')))
      .catch(() => {});
  }, []);

  const openAdd = () => {
    setEditDriver(null);
    setForm({ name: '', phone: '', branch_id: branches[0]?.id || '' });
    setShowForm(true);
  };

  const openEdit = (d) => {
    setEditDriver(d);
    setForm({ name: d.name, phone: d.phone, branch_id: d.branch_id || '' });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.warning('يرجى إدخال اسم المندوب');
    if (!form.phone.trim()) return toast.warning('يرجى إدخال رقم الجوال');
    if (!form.branch_id) return toast.warning('يرجى اختيار الفرع');

    try {
      if (editDriver) {
        await updateDriver(editDriver.id, { name: form.name, phone: form.phone, branch_id: form.branch_id });
        toast.success('تم التحديث');
      } else {
        await createDriver(form);
        toast.success('تم الإضافة');
      }
      setShowForm(false);
      refetch();
    } catch (e) {
      toast.error(e.message || 'فشل الحفظ');
    }
  };

  const handleDelete = async (d) => {
    if (!window.confirm(`حذف المندوب "${d.name}"؟`)) return;
    try {
      await deleteDriver(d.id);
      toast.success('تم الحذف');
      refetch();
    } catch (e) {
      toast.error(e.message || 'فشل الحذف');
    }
  };

  const handleLink = async (driverId, userId) => {
    try {
      await linkDriverUser(driverId, userId);
      toast.success('تم الربط');
      setLinking(null);
      refetch();
    } catch (e) {
      toast.error(e.message || 'فشل');
    }
  };

  const handleUnlink = async (driverId) => {
    try {
      await unlinkDriverUser(driverId);
      toast.success('تم فك الربط');
      refetch();
    } catch (e) {
      toast.error(e.message || 'فشل');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-black text-gray-800 dark:text-white">🛵 إدارة المناديب ({drivers.length})</h2>
        <button onClick={openAdd} className="bg-teal-700 text-white px-4 py-2 rounded-xl font-bold text-sm">➕ إضافة مندوب</button>
      </div>

      <div className="space-y-2">
        {drivers.map((d) => (
          <div key={d.id} className="flex flex-wrap items-center gap-2 p-3 border dark:border-gray-700 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center font-bold">🛵</div>
            <div className="flex-1 min-w-[140px]">
              <h4 className="font-bold text-sm text-gray-800 dark:text-white">{d.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400" dir="ltr">{d.phone}</p>
              <p className="text-xs mt-0.5">
                {d.user_id ? <span className="text-green-600 dark:text-green-400 font-bold">✅ مرتبط</span> : <span className="text-red-600 dark:text-red-400 font-bold">⚠️ غير مرتبط</span>}
              </p>
            </div>

            <div className="flex gap-1 flex-wrap">
              <button onClick={() => openEdit(d)} className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-1 rounded-lg text-xs font-bold">✏️</button>
              <button onClick={() => handleDelete(d)} className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 px-2 py-1 rounded-lg text-xs font-bold">🗑️</button>
              {d.user_id ? (
                <button onClick={() => handleUnlink(d.id)} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-lg text-xs font-bold">فك الربط</button>
              ) : linking === d.id ? (
                <select onChange={(e) => e.target.value && handleLink(d.id, e.target.value)} className="text-xs border rounded px-2 py-1" defaultValue="">
                  <option value="">اختر الحساب</option>
                  {profiles.map((p) => <option key={p.id} value={p.id}>{p.full_name || p.id.slice(0, 8)}</option>)}
                </select>
              ) : (
                <button onClick={() => setLinking(d.id)} className="bg-teal-700 text-white px-2 py-1 rounded-lg text-xs font-bold">ربط</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[80] bg-black/70 flex items-end justify-center">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-t-3xl p-5 space-y-3">
            <h2 className="text-xl font-black text-gray-800 dark:text-white">{editDriver ? '✏️ تعديل مندوب' : '➕ إضافة مندوب'}</h2>

            <input type="text" placeholder="اسم المندوب *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />

            <input type="tel" dir="ltr" placeholder="رقم الجوال (05xxxxxxxx) *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />

            <select value={form.branch_id} onChange={(e) => setForm({ ...form, branch_id: e.target.value })}
              className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
              <option value="">اختر الفرع *</option>
              {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>

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
