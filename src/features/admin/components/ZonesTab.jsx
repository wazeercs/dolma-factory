import React, { useState, useEffect } from 'react';
import { useBranches } from '../../../hooks/useSupabaseData';
import { fetchDeliveryZones, updateDeliveryZone } from '../../../services/supabase/admin';
import { useToast } from '../../../components/Toast';

export default function ZonesTab() {
  const toast = useToast();
  const branches = useBranches();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (branches.length > 0 && !selectedBranch) setSelectedBranch(branches[0]);
  }, [branches, selectedBranch]);

  useEffect(() => {
    if (!selectedBranch) return;
    setLoading(true);
    fetchDeliveryZones(selectedBranch.id)
      .then(setZones)
      .catch(() => toast.error('فشل تحميل المناطق'))
      .finally(() => setLoading(false));
  }, [selectedBranch]);

  const handleSave = async (zone) => {
    try {
      await updateDeliveryZone(
        zone.id, zone.name,
        zone.min_distance_km, zone.max_distance_km,
        zone.delivery_fee, zone.min_order_amount || 0
      );
      toast.success('تم الحفظ');
    } catch (e) {
      toast.error(e.message || 'فشل الحفظ');
    }
  };

  const updateLocal = (id, field, value) => {
    setZones(zones.map((z) => z.id === id ? { ...z, [field]: value } : z));
  };

  if (loading) return <div className="p-8 text-center text-gray-400">⏳ جاري التحميل...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-black text-gray-800 dark:text-white">📍 مناطق التوصيل</h2>
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

      <div className="space-y-3">
        {zones.map((zone) => (
          <div key={zone.id} className="border dark:border-gray-700 rounded-xl p-3 space-y-2">
            <input
              type="text"
              value={zone.name}
              onChange={(e) => updateLocal(zone.id, 'name', e.target.value)}
              className="w-full font-bold text-sm p-2 rounded border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">من كم</label>
                <input
                  type="number" step="0.5"
                  value={zone.min_distance_km}
                  onChange={(e) => updateLocal(zone.id, 'min_distance_km', parseFloat(e.target.value))}
                  className="w-full text-sm p-2 rounded border dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">إلى كم</label>
                <input
                  type="number" step="0.5"
                  value={zone.max_distance_km}
                  onChange={(e) => updateLocal(zone.id, 'max_distance_km', parseFloat(e.target.value))}
                  className="w-full text-sm p-2 rounded border dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">الرسوم (SR)</label>
                <input
                  type="number"
                  value={zone.delivery_fee}
                  onChange={(e) => updateLocal(zone.id, 'delivery_fee', parseFloat(e.target.value))}
                  className="w-full text-sm p-2 rounded border dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => handleSave(zone)}
                  className="w-full bg-teal-700 text-white py-2 rounded-lg font-bold text-xs"
                >
                  💾 حفظ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
