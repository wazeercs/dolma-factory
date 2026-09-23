import React, { useState } from 'react';
import { useOrders, useBranches, useDrivers } from '../../hooks/useSupabaseData';
import { updateOrderStatus } from '../../hooks/useOrdersApi';
import useAudioAlarm from '../../hooks/useAudioAlarm';
import { useToast } from '../../components/Toast';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useAuth } from '../auth/AuthProvider';
import { isAdmin } from '../../lib/permissions';
import OrderCard from './components/OrderCard';
import ReceiptModal from './components/ReceiptModal';
import AudioAlarmBanner from './components/AudioAlarmBanner';

export default function BranchApp() {
  const toast = useToast();
  const isOnline = useOnlineStatus();
  const { profile, role, branchId: myBranchId } = useAuth();
  const branches = useBranches();
  const [adminSelectedBranch, setAdminSelectedBranch] = useState(null);
  const [printOrder, setPrintOrder] = useState(null);

  // القفل: الكاشير يستخدم فرعه فقط، الإدارة تختار
  const effectiveBranchId = isAdmin(role) 
    ? (adminSelectedBranch || myBranchId || branches[0]?.id)
    : myBranchId;

  const { orders, loading } = useOrders(effectiveBranchId, true);
  const { drivers } = useDrivers(effectiveBranchId);

  const newOrders = orders.filter((o) => o.status === 'pending');
  const hasNew = newOrders.length > 0;
  const { initAudio, disableAudio, enabled: audioEnabled } = useAudioAlarm(hasNew);

  const handleStatus = async (orderId, status, driverId = null, driverName = null) => {
    try {
      await updateOrderStatus(orderId, status, driverId, driverName);
      toast.success('تم تحديث حالة الطلب');
    } catch (err) {
      toast.error(err.message || 'فشل تحديث حالة الطلب');
    }
  };

  const handleAssign = (orderId, driver) => {
    handleStatus(orderId, 'assigned', driver.id, driver.name);
  };

  // إذا لم يكن للمستخدم فرع محدد
  if (!effectiveBranchId && !loading) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-300 dark:border-yellow-700 rounded-2xl p-6 text-center">
          <p className="text-4xl mb-3">⚠️</p>
          <h2 className="font-black text-lg text-yellow-800 dark:text-yellow-200 mb-2">
            لم يتم تعيينك لفرع
          </h2>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            تواصل مع الإدارة لتعيينك لفرع معين
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400 dark:text-gray-500">
        ⏳ جاري تحميل الطلبات...
      </div>
    );
  }

  const currentBranchName = branches.find((b) => b.id === effectiveBranchId)?.name || 'الفرع';

  return (
    <div className="p-3 max-w-6xl mx-auto">
      {!isOnline && (
        <div className="bg-red-500 text-white p-2 rounded-lg text-center text-xs font-bold mb-3">
          ⚠️ لا يوجد اتصال بالإنترنت
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="text-lg font-black text-gray-800 dark:text-white">
            🖥️ شاشة الكاشير
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {currentBranchName} • {orders.length} طلب نشط • {newOrders.length} جديد
          </p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {/* اختيار الفرع — للإدارة فقط */}
          {isAdmin(role) && branches.length > 1 && (
            <select
              value={effectiveBranchId || ''}
              onChange={(e) => setAdminSelectedBranch(e.target.value)}
              className="text-xs bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 font-bold text-gray-800 dark:text-white"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          )}

          {/* زر التنبيه */}
          {!audioEnabled ? (
            <button
              onClick={() => {
                const ok = initAudio();
                if (ok) toast.success('تم تفعيل التنبيهات 🔔');
                else toast.error('فشل تفعيل الصوت');
              }}
              className="pulse-red text-white px-4 py-2 rounded-lg font-bold text-sm"
            >
              🔔 تفعيل التنبيه
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-lg font-bold text-xs">
                ✅ التنبيهات مفعلة
              </span>
              <button
                onClick={() => {
                  disableAudio();
                  toast.info('تم إيقاف التنبيهات');
                }}
                className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-2 rounded-lg text-xs"
              >
                🔕
              </button>
            </div>
          )}
        </div>
      </div>

      <AudioAlarmBanner
        hasNew={hasNew}
        newCount={newOrders.length}
        audioEnabled={audioEnabled}
        onEnable={() => initAudio()}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {orders.map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            drivers={drivers}
            onAdvance={handleStatus}
            onAssign={handleAssign}
            onPrint={setPrintOrder}
          />
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <p className="text-5xl mb-2">☕</p>
          <p>لا توجد طلبات نشطة حالياً</p>
        </div>
      )}

      {printOrder && (
        <ReceiptModal order={printOrder} onClose={() => setPrintOrder(null)} />
      )}
    </div>
  );
}
