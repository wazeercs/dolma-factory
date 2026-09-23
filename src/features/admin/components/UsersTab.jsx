import React, { useState, useEffect } from 'react';
import { useBranches } from '../../../hooks/useSupabaseData';
import { fetchAllProfiles, updateUserRole } from '../../../services/supabase/admin';
import { useToast } from '../../../components/Toast';
import { ROLE_LABELS } from '../../../lib/constants';

const ROLES = ['customer', 'cashier', 'branch_manager', 'driver', 'admin', 'super_admin'];

export default function UsersTab() {
  const toast = useToast();
  const branches = useBranches();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchAllProfiles()
      .then(setUsers)
      .catch(() => toast.error('فشل تحميل المستخدمين'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleRoleChange = async (userId, newRole, branchId) => {
    try {
      await updateUserRole(userId, newRole, branchId);
      toast.success('تم تحديث الدور');
      load();
    } catch (e) {
      toast.error(e.message || 'فشل التحديث');
    }
  };

  const handleBranchChange = async (userId, role, branchId) => {
    try {
      await updateUserRole(userId, role, branchId || null);
      toast.success('تم تحديث الفرع');
      load();
    } catch (e) {
      toast.error(e.message || 'فشل التحديث');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">⏳ جاري التحميل...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-black mb-4 text-gray-800 dark:text-white">👥 إدارة المستخدمين ({users.length})</h2>

      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="flex flex-wrap items-center gap-2 p-3 border dark:border-gray-700 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">
              {(u.full_name || '?').charAt(0)}
            </div>

            <div className="flex-1 min-w-[120px]">
              <h4 className="font-bold text-sm text-gray-800 dark:text-white">
                {u.full_name || 'بدون اسم'}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400" dir="ltr">{u.phone || '-'}</p>
            </div>

            <select
              value={u.role}
              onChange={(e) => handleRoleChange(u.id, e.target.value, u.branch_id)}
              className="text-xs bg-gray-100 dark:bg-gray-700 border rounded-lg px-2 py-1 font-bold"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>

            {branches.length > 0 && (
              <select
                value={u.branch_id || ''}
                onChange={(e) => handleBranchChange(u.id, u.role, e.target.value)}
                className="text-xs bg-gray-100 dark:bg-gray-700 border rounded-lg px-2 py-1"
              >
                <option value="">بدون فرع</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
