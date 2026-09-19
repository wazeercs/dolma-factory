#!/data/data/com.termux/files/usr/bin/bash

cat > src/components/DriverApp.jsx << 'DRIVEREOF'
import React, { useState, useEffect } from 'react';
import { useDrivers, useOrders } from '../hooks/useSupabaseData';
import { updateOrderStatus, toggleDriverAvailability } from '../hooks/useOrdersApi';
import { useToast } from './Toast';

export default function DriverApp() {
  const toast = useToast();
  const [currentDriver, setCurrentDriver] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dolma_driver') || 'null');
    } catch { return null; }
  });
  const drivers = useDrivers();
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

  const toggleAvailability = async () => {
    try {
      const newState = !currentDriver.is_available;
      await toggleDriverAvailability(currentDriver.id, newState);
      setCurrentDriver({ ...currentDriver, is_available: newState });
      toast.success(newState ? 'أنت الآن متاح ✅' : 'أنت الآن مشغول ⏸');
    } catch (e) {
      toast.error('فشل تحديث الحالة');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(newStatus === 'delivered' ? 'تم التسليم بنجاح 🎉' : 'تم تحديث الطلب');
    } catch (e) {
      toast.error('فشل تحديث الطلب');
    }
  };

  if (!currentDriver) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center text-4xl">🛵</div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-white mb-2">من أنت؟</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">اختر اسمك للبدء</p>
        </div>

        <div className="space-y-3">
          {drivers.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setCurrentDriver(d);
                toast.success('مرحباً ' + d.name + '!');
              }}
              className="w-full p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-400 transition-all text-right flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold text-lg">
                {d.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 dark:text-white">{d.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400" dir="ltr">{d.phone}</p>
              </div>
              <span className="text-gray-400">←</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const myOrders = orders.filter(
    (o) => o.driver_id === currentDriver.id && o.status !== 'delivered' && o.status !== 'cancelled'
  );
  const completedToday = orders.filter(
    (o) => o.driver_id === currentDriver.id &&
           o.status === 'delivered' &&
           new Date(o.created_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-4 flex items-center gap-3 flex-wrap">
        <div className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-black text-xl">
          {currentDriver.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-black text-gray-800 dark:text-white truncate">{currentDriver.name}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">🚚 {completedToday} توصيلة اليوم</p>
        </div>
        <button
          onClick={toggleAvailability}
          className={'px-4 py-2 rounded-xl font-bold text-sm ' + (currentDriver.is_available
              ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300')}
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
          {myOrders.map((o) => {
            const lng = o.delivery_location && o.delivery_location.coordinates ? o.delivery_location.coordinates[0] : 46.6753;
            const lat = o.delivery_location && o.delivery_location.coordinates ? o.delivery_location.coordinates[1] : 24.7136;
            return (
              <div key={o.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border-r-4 border-blue-500">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                      #{o.order_number}
                    </span>
                    <h4 className="font-bold text-gray-800 dark:text-white mt-2">{o.customer_name}</h4>
                    <a href={'tel:' + o.customer_phone} className="text-xs text-teal-600 dark:text-teal-400 font-bold" dir="ltr">
                      📞 {o.customer_phone}
                    </a>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-400">
                      {new Date(o.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="font-black text-teal-700 dark:text-teal-400 text-lg">{o.total} SR</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl mb-3 text-sm font-bold text-gray-700 dark:text-gray-200">
                  {(o.order_items || []).map((item, i) => (
                    <div key={i} className="py-0.5">
                      {item.product_name} {item.flavor_name && '(' + item.flavor_name + ')'} - {item.variant_name} × {item.quantity}
                    </div>
                  ))}
                </div>

                {o.order_type === 'delivery' && o.delivery_address && (
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl mb-3 text-xs text-blue-800 dark:text-blue-200 flex gap-2">
                    <span>📍</span>
                    <span>{o.delivery_address}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  {o.status === 'ready' && (
                    <button
                      onClick={() => handleStatusChange(o.id, 'on_way')}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm"
                    >
                      🛵 بدء التوصيل
                    </button>
                  )}
                  {o.status === 'on_way' && (
                    <>
                      <a
                        href={'https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lng}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-bold text-sm text-center"
                      >
                        🗺️ الخريطة
                      </a>
                      <button
                        onClick={() => handleStatusChange(o.id, 'delivered')}
                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold text-sm"
                      >
                        ✅ تم التسليم
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
DRIVEREOF

echo ""
echo "✅ تم إنشاء DriverApp.jsx بنجاح!"
ls -la src/components/DriverApp.jsx
