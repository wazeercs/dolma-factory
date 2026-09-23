import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useDrivers, useBranches } from '../../../hooks/useSupabaseData';
import { fetchAllProfiles, linkDriverUser, unlinkDriverUser } from '../../../services/supabase/admin';
import { useToast } from '../../../components/Toast';

export default function DriversTab() {
  const toast = useToast();
  const branches = useBranches();
  const { drivers } = useDrivers();
  const [profiles, setProfiles] = useState([]);
  const [linking, setLinking] = useState(null);

  useEffect(() => {
    fetchAllProfiles()
      .then((data) => setProfiles(data.filter((p) => p.role === 'driver')))
      .catch(() => {});
  }, []);

  const handleLink = async (driverId, userId) => {
    try {
      await linkDriverUser(driverId, userId);
      toast.success('تم الربط');
      setLinking(null);
      window.location.reload();
    } catch (e) {
      toast.error(e.message || 'فشل الربط');
    }
  };

  const handleUnlink = async (driverId) => {
    try {
      await unlinkDriverUser(driverId);
      toast.success('تم فك الربط');
      window.location.reload();
    } catch (e) {
      toast.error(e.message || 'فشل');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-black mb-4 text-gray-800 dark:text-white">🛵 إدارة المناديب ({drivers.length})</h2>

      <div className="space-y-2">
        {drivers.map((d) => (
          <div key={d.id} className="flex flex-wrap items-center gap-2 p-3 border dark:border-gray-700 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">
              🛵
            </div>
            <div className="flex-1 min-w-[120px]">
              <h4 className="font-bold text-sm text-gray-800 dark:text-white">{d.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400" dir="ltr">{d.phone}</p>
              <p className="text-xs mt-1">
                {d.user_id ? (
                  <span className="text-green-600 dark:text-green-400 font-bold">✅ مرتبط بحساب</span>
                ) : (
                  <span className="text-red-600 dark:text-red-400 font-bold">⚠️ غير مرتبط</span>
                )}
              </p>
            </div>

            {d.user_id ? (
              <button
                onClick={() => handleUnlink(d.id)}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg font-bold text-xs"
              >
                فك الربط
              </button>
            ) : linking === d.id ? (
              <select
                onChange={(e) => e.target.value && handleLink(d.id, e.target.value)}
                className="text-xs bg-gray-100 dark:bg-gray-700 border rounded-lg px-2 py-1"
                defaultValue=""
              >
                <option value="">اختر الحساب</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>{p.full_name || p.id.slice(0, 8)}</option>
                ))}
              </select>
            ) : (
              <button
                onClick={() => setLinking(d.id)}
                className="bg-teal-700 text-white px-3 py-2 rounded-lg font-bold text-xs"
              >
                ربط بحساب
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
