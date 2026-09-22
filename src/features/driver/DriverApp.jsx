import React, { useState, useEffect } from 'react';
import { useDrivers, useOrders } from '../../hooks/useSupabaseData';
import { updateOrderStatus, toggleDriverAvailability } from '../../hooks/useOrdersApi';
import { useToast } from '../../components/Toast';
import { useAuth } from '../auth/AuthProvider';
import DriverSelect from './components/DriverSelect';
import DriverOrderCard from './components/DriverOrderCard';

export default function DriverApp() {
  const toast = useToast();
  const { profile } = useAuth();
  const [currentDriver, setCurrentDriver] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dolma_driver') || 'null');
    } catch {
      return null;
    }
  });

  const { drivers } = useDrivers();
  const { orders } = useOrders();

  useEffect(() => {
    if (currentDriver) {
      localStorage.setItem('dolma_driver', JSON.stringify(currentDriver));
      const fresh = drivers.find((d) => d.id === currentDriver.id);
      if (fresh && fresh.is_available !== currentDriver.is_available) {
        setCurrentDriver(fresh);
      }
    }
  }, [currentDriver, drivers]);

  const logout = () => {
    setCurrentDriver(null);
    localStorage.removeItem('dolma_driver');
    toast.info('تم تسجيل الخروج');
  };

  const handleToggleAvailability = async () => {
    try {
      const newState = !currentDriver.is_available;
      await toggleDriverAvailability(currentDriver.id, newState);
      setCurrentDriver({ ...currentDriver, is_available: newState });
      toast.success(newState ? 'أنت الآن متاح ✅' : 'أنت الآن مشغول ⏸');
    } catch {
      toast.error('فشل تحديث الحالة');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(newStatus === 'delivered' ? 'تم التسليم بنجاح 🎉' : 'تم تحديث الطلب');
    } catch {
      toast.error('فشل تحديث الطلب');
    }
  };

  if (!currentDriver) {
    return <DriverSelect drivers={drivers} onSelect={setCurrentDriver} />;
  }

  const myOrders = orders.filter(
    (o) =>
      o.driver_id === currentDriver.id &&
      o.status !== 'delivered' &&
      o.status !== 'cancelled' &&
      o.status !== 'rejected'
  );

  const completedToday = orders.filter(
    (o) =>
      o.driver_id === currentDriver.id &&
      o.status === 'delivered' &&
      new Date(o.created_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-4 flex items-center gap-3 flex-wrap">
        <div className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-black text-xl">
          {currentDriver.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-black text-gray-800 dark:text-white truncate">
            {currentDriver.name}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            🚚 {completedToday} توصيلة اليوم
          </p>
        </div>
        <button
          onClick={handleToggleAvailability}
          className={`px-4 py-2 rounded-xl font-bold text-sm ${
            currentDriver.is_available
              ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
          }`}
        >
          {currentDriver.is_available ? '✓ متاح' : '⏸ مشغول'}
        </button>
        <button
          onClick={logout}
          className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm"
        >
          خروج
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
