import React, { useState, useEffect } from 'react';
import { fetchLoyaltyDashboard, TIER_LABELS, TIER_COLORS } from '../../../services/supabase/loyalty';
import { useToast } from '../../../components/Toast';
import EmptyState from '../../../components/EmptyState';

export default function LoyaltyTab() {
  const toast = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLoyaltyDashboard()
      .then(setCustomers)
      .catch(() => toast.error('فشل تحميل البيانات'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' 
    ? customers 
    : customers.filter((c) => c.tier === filter);

  const stats = {
    total: customers.length,
    totalPoints: customers.reduce((s, c) => s + (c.points || 0), 0),
    gold: customers.filter((c) => c.tier === 'gold' || c.tier === 'platinum').length,
  };

  if (loading) return <div className="p-8 text-center text-gray-400">⏳ جاري التحميل...</div>;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border-r-4 border-purple-500">
          <h3 className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">إجمالي العملاء</h3>
          <p className="text-2xl font-black text-gray-800 dark:text-white num-ltr">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border-r-4 border-pink-500">
          <h3 className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">إجمالي النقاط</h3>
          <p className="text-2xl font-black text-gray-800 dark:text-white num-ltr">{stats.totalPoints}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border-r-4 border-yellow-500">
          <h3 className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">عملاء ذهبيون</h3>
          <p className="text-2xl font-black text-gray-800 dark:text-white num-ltr">{stats.gold}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto">
        {[
          ['all', 'الكل'],
          ['bronze', '🥉 برونزي'],
          ['silver', '🥈 فضي'],
          ['gold', '🥇 ذهبي'],
          ['platinum', '💎 بلاتيني'],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap ${
              filter === k ? 'bg-purple-700 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
        <h2 className="text-lg font-black mb-4 text-gray-800 dark:text-white">
          🎁 عملاء برنامج الولاء ({filtered.length})
        </h2>

        {filtered.length === 0 ? (
          <EmptyState
            icon="🎁"
            title="لا يوجد عملاء بعد"
            description="سيظهر العملاء هنا بعد أول طلب من كل رقم."
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 border dark:border-gray-700 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-2xl">
                  👤
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-gray-800 dark:text-white">
                    {c.full_name || 'عميل'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 num-ltr">{c.phone}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    📦 {c.total_orders} طلب • 💰 {c.total_spent} ريال
                  </p>
                </div>
                <div className="text-left">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${TIER_COLORS[c.tier]}`}>
                    {TIER_LABELS[c.tier]}
                  </span>
                  <p className="font-black text-purple-700 dark:text-purple-300 text-lg mt-1 num-ltr">
                    {c.points} <span className="text-xs">نقطة</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
