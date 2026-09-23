import React, { useState, useEffect } from 'react';
import { useBranches } from '../../../hooks/useSupabaseData';
import { fetchReportSummary, fetchTopProducts } from '../../../services/supabase/reports';
import { useToast } from '../../../components/Toast';

const RANGES = [
  { key: 'today', label: 'اليوم', days: 0 },
  { key: 'week', label: 'هذا الأسبوع', days: 7 },
  { key: 'month', label: 'هذا الشهر', days: 30 },
];

export default function ReportsTab() {
  const toast = useToast();
  const branches = useBranches();
  const [range, setRange] = useState('today');
  const [branchId, setBranchId] = useState(null);
  const [stats, setStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const start = new Date();
      const rangeConf = RANGES.find((r) => r.key === range);
      if (range === 'today') start.setHours(0, 0, 0, 0);
      else start.setDate(start.getDate() - rangeConf.days);

      const [s, tp] = await Promise.all([
        fetchReportSummary(start, now, branchId),
        fetchTopProducts(start, now, 10),
      ]);
      setStats(s);
      setTopProducts(tp);
    } catch (e) {
      toast.error(e.message || 'فشل التقرير');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [range, branchId]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 flex flex-wrap gap-2">
        <div className="flex gap-2">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-4 py-2 rounded-xl font-bold text-sm ${
                range === r.key ? 'bg-teal-700 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        {branches.length > 1 && (
          <select
            value={branchId || ''}
            onChange={(e) => setBranchId(e.target.value || null)}
            className="text-xs bg-gray-100 dark:bg-gray-700 border rounded-lg px-3 py-2 font-bold"
          >
            <option value="">كل الفروع</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        )}
      </div>

      {loading && <div className="text-center py-8 text-gray-400">⏳ جاري التحميل...</div>}

      {stats && !loading && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border-r-4 border-teal-500">
              <h3 className="text-gray-500 dark:text-gray-400 font-bold text-xs mb-2">الإيرادات</h3>
              <p className="text-2xl font-black text-gray-800 dark:text-white">{stats.revenue} SR</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border-r-4 border-blue-500">
              <h3 className="text-gray-500 dark:text-gray-400 font-bold text-xs mb-2">الطلبات</h3>
              <p className="text-2xl font-black text-gray-800 dark:text-white">{stats.total_orders}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border-r-4 border-green-500">
              <h3 className="text-gray-500 dark:text-gray-400 font-bold text-xs mb-2">مكتملة</h3>
              <p className="text-2xl font-black text-gray-800 dark:text-white">{stats.delivered_orders}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border-r-4 border-yellow-500">
              <h3 className="text-gray-500 dark:text-gray-400 font-bold text-xs mb-2">متوسط الطلب</h3>
              <p className="text-2xl font-black text-gray-800 dark:text-white">{stats.avg_order} SR</p>
            </div>
          </div>

          {/* Secondary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ملغاة</p>
              <p className="font-black text-red-600 dark:text-red-400">{stats.cancelled_orders}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">رسوم توصيل</p>
              <p className="font-black text-gray-800 dark:text-white">{stats.delivery_fees} SR</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">خصومات</p>
              <p className="font-black text-gray-800 dark:text-white">{stats.discounts} SR</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">نقدي / بطاقة</p>
              <p className="font-black text-gray-800 dark:text-white">{stats.cash_orders} / {stats.card_orders}</p>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <h2 className="text-lg font-black mb-4 text-gray-800 dark:text-white">🏆 أعلى المنتجات مبيعاً</h2>
            {topProducts.length === 0 ? (
              <p className="text-center text-gray-400 py-6">لا توجد بيانات</p>
            ) : (
              <div className="space-y-2">
                {topProducts.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border dark:border-gray-700 rounded-xl">
                    <span className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-black text-sm">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-800 dark:text-white">{p.product_name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{p.total_quantity} قطعة</p>
                    </div>
                    <b className="text-teal-700 dark:text-teal-400">{p.total_revenue} SR</b>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
