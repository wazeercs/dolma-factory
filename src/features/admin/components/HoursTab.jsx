import React, { useState, useEffect } from 'react';
import { useBranches } from '../../../hooks/useSupabaseData';
import { fetchBusinessHours, updateBusinessHours } from '../../../services/supabase/admin';
import { useToast } from '../../../components/Toast';

const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export default function HoursTab() {
  const toast = useToast();
  const branches = useBranches();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [hours, setHours] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (branches.length > 0 && !selectedBranch) setSelectedBranch(branches[0]);
  }, [branches, selectedBranch]);

  useEffect(() => {
    if (!selectedBranch) return;
    setLoading(true);
    fetchBusinessHours(selectedBranch.id)
      .then((data) => {
        const map = {};
        data.forEach((h) => { map[h.day_of_week] = h; });
        setHours(map);
      })
      .catch(() => toast.error('فشل تحميل الساعات'))
      .finally(() => setLoading(false));
  }, [selectedBranch]);

  const handleUpdate = async (dow, field, value) => {
    const current = hours[dow] || { is_closed: false, open_time: '10:00', close_time: '23:59' };
    const updated = { ...current, [field]: value };
    setHours({ ...hours, [dow]: updated });

    try {
      await updateBusinessHours(
        selectedBranch.id,
        dow,
        updated.is_closed,
        updated.open_time,
        updated.close_time
      );
      toast.success('تم الحفظ');
    } catch (e) {
      toast.error(e.message || 'فشل الحفظ');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">⏳ جاري التحميل...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-black text-gray-800 dark:text-white">🕐 ساعات العمل</h2>
        {branches.length > 1 && (
          <select
            value={selectedBranch?.id || ''}
            onChange={(e) => {
              const b = branches.find((x) => x.id === e.target.value);
              if (b) setSelectedBranch(b);
            }}
            className="text-xs bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 font-bold text-gray-800 dark:text-white"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="space-y-2">
        {DAY_NAMES.map((day, dow) => {
          const h = hours[dow] || { is_closed: false, open_time: '10:00', close_time: '23:59' };
          return (
            <div key={dow} className="flex items-center gap-2 flex-wrap bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
              <span className="font-bold text-sm text-gray-800 dark:text-white w-20">{day}</span>

              <label className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={!h.is_closed}
                  onChange={(e) => handleUpdate(dow, 'is_closed', !e.target.checked)}
                  className="w-4 h-4"
                />
                مفتوح
              </label>

              {!h.is_closed && (
                <>
                  <input
                    type="time"
                    value={h.open_time}
                    onChange={(e) => handleUpdate(dow, 'open_time', e.target.value)}
                    className="text-xs p-1 rounded border dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                  <span className="text-xs">إلى</span>
                  <input
                    type="time"
                    value={h.close_time}
                    onChange={(e) => handleUpdate(dow, 'close_time', e.target.value)}
                    className="text-xs p-1 rounded border dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </>
              )}

              {h.is_closed && (
                <span className="text-xs font-bold text-red-600 dark:text-red-400">مغلق</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
