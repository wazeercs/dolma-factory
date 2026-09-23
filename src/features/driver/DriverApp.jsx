import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useOrders } from '../../hooks/useSupabaseData';
import { updateOrderStatus, toggleDriverAvailability } from '../../hooks/useOrdersApi';
import { useToast } from '../../components/Toast';
import { useAuth } from '../auth/AuthProvider';
import DriverOrderCard from './components/DriverOrderCard';

export default function DriverApp() {
  const toast = useToast();
  const { profile, user } = useAuth();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orders } = useOrders();

  // جلب بيانات المندوب من قاعدة البيانات
  useEffect(() => {
    const load = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        setError(error.message);
      } else if (!data) {
        setError('لم يتم ربط حسابك بأي مندوب. تواصل مع الإدارة.');
      } else {
        setDriver(data);
      }
      setLoading(false);
    };

    load();
  }, [user?.id]);

  // مزامنة حالة التوفر
  useEffect(() => {
    if (!driver) return;
    const ch = supabase
      .channel('driver-self-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'drivers', filter: `id=eq.${driver.id}` },
        (payload) => setDriver((prev) => ({ ...prev, ...payload.new }))
      )
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [driver?.id]);

  const handleToggleAvailability = async () => {
    try {
      const newState = !driver.is_available;
      await toggleDriverAvailability(driver.id, newState);
      setDriver({ ...driver, is_available: newState });
      toast.success(newState ? 'أنت الآن متاح ✅' : 'أنت الآن مشغول ⏸');
    } catch {
      toast.error('فشل تحديث الحالة');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(newStatus === 'delivered' ? 'تم التسليم بنجاح 🎉' : 'تم تحديث الطلب');
    } catch (err) {
      toast.error(err.message || 'فشل تحديث الطلب');
    }
  };

  // شاشة التحميل
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400 dark:text-gray-500">
        ⏳ جاري التحقق من حسابك...
      </div>
    );
  }

  // شاشة الخطأ
  if (error || !driver) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-2xl p-6 text-center">
          <p className="text-4xl mb-3">⚠️</p>
          <h2 className="font-black text-lg text-red-700 dark:text-red-300 mb-2">
            لا يمكن الوصول
          </h2>
          <p className="text-sm text-red-600 dark:text-red-400">
            {error || 'لم يتم ربط حسابك بأي مندوب'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            تواصل مع الإدارة لربط حسابك
          </p>
          <p className="text-xs text-gray-400 mt-2" dir="ltr">
            {profile?.email || user?.email || ''}
          </p>
        </div>
      </div>
    );
  }

  const myOrders = orders.filter(
    (o) =>
      o.driver_id === driver.id &&
      o.status !== 'delivered' &&
      o.status !== 'cancelled' &&
      o.status !== 'rejected'
  );

  const completedToday = orders.filter(
    (o) =>
      o.driver_id === driver.id &&
      o.status === 'delivered' &&
      new Date(o.created_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-4 flex items-center gap-3 flex-wrap">
        <div className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-black text-xl">
          {driver.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-black text-gray-800 dark:text-white truncate">
            {driver.name}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            🚚 {completedToday} توصيلة اليوم
          </p>
        </div>
        <button
          onClick={handleToggleAvailability}
          className={`px-4 py-2 rounded-xl font-bold text-sm ${
            driver.is_available
              ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
          }`}
        >
          {driver.is_available ? '✓ متاح' : '⏸ مشغول'}
        </button>
      </div>

      <h3 className="font-black text-gray-800 dark:text-white mb-3 px-1">
        طلباتي الحالية ({myOrders.length})
      </h3>

      {myOrders.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <p className="text-5xl mb-2">🎉</p>
          <p>لا توجد طلبات مسندة إليك حالياً</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myOrders.map((o) => (
            <DriverOrderCard
              key={o.id}
              order={o}
              onStartDelivery={(id) => handleStatusChange(id, 'out_for_delivery')}
              onDeliver={(id) => handleStatusChange(id, 'delivered')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
