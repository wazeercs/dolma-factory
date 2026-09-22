#!/data/data/com.termux/files/usr/bin/bash
set -e

mkdir -p src/features/branch/components

# ============================================
# 1. OrderCard.jsx
# ============================================
cat > src/features/branch/components/OrderCard.jsx << 'EOF'
import React from 'react';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../../lib/constants';

export default function OrderCard({
  order, drivers, onAdvance, onAssign, onPrint,
}) {
  const label = ORDER_STATUS_LABELS[order.status] || order.status;
  const borderColor = ORDER_STATUS_COLORS[order.status] || 'border-gray-400';

  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border-r-4 ${borderColor}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
              #{order.order_number}
            </span>
            <span className={`text-xs font-bold px-2 py-1 rounded ${
              order.status === 'pending' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
              order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' :
              order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
              'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {label}
            </span>
            <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {order.payment_method === 'cash' ? '💵' : '💳'}
            </span>
          </div>
          <h3 className="font-bold text-base mt-2 text-gray-800 dark:text-white">{order.customer_name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400" dir="ltr">{order.customer_phone}</p>
        </div>
        <div className="text-left">
          <span className="text-xs font-bold text-teal-700 dark:text-teal-400 block">
            {order.order_type === 'delivery' ? '🚗 توصيل' : '🏪 استلام'}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl mb-3 text-sm font-bold text-gray-700 dark:text-gray-200">
        {(order.order_items || []).map((item, i) => (
          <div key={i} className="py-0.5">
            {item.product_name}
            {item.flavor_name && ` (${item.flavor_name})`}
            {' - '}{item.variant_name} × {item.quantity}
          </div>
        ))}
        {order.driver_name && (
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            🛵 المندوب: {order.driver_name}
          </div>
        )}
      </div>

      {/* Total + Actions */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <span className="font-black text-lg text-teal-700 dark:text-teal-400">{order.total} SR</span>
          {order.discount > 0 && (
            <span className="text-xs text-green-600 dark:text-green-400 mr-2">
              (خصم {order.discount})
            </span>
          )}
        </div>
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => onPrint(order)}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg font-bold text-xs"
          >
            🖨️
          </button>

          {order.status === 'pending' && (
            <>
              <button
                onClick={() => onAdvance(order.id, 'confirmed')}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg font-bold text-xs"
              >
                تأكيد
              </button>
              <button
                onClick={() => onAdvance(order.id, 'rejected')}
                className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-xs"
              >
                رفض
              </button>
            </>
          )}

          {order.status === 'confirmed' && (
            <button
              onClick={() => onAdvance(order.id, 'preparing')}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold text-xs"
            >
              بدء التحضير
            </button>
          )}

          {order.status === 'preparing' && (
            <button
              onClick={() => onAdvance(order.id, 'ready_for_delivery')}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-xs"
            >
              جاهز للتوصيل
            </button>
          )}

          {order.status === 'ready_for_delivery' && (
            <select
              onChange={(e) => {
                const driverId = e.target.value;
                if (!driverId) return;
                const d = drivers.find((x) => x.id === driverId);
                if (d) onAssign(order.id, d);
              }}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-xs"
            >
              <option value="">تعيين مندوب</option>
              {drivers.filter((d) => d.is_available).map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          )}

          {order.status === 'on_way' && (
            <button
              onClick={() => onAdvance(order.id, 'delivered')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-xs"
            >
              تم التسليم
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
EOF

# ============================================
# 2. ReceiptModal.jsx
# ============================================
cat > src/features/branch/components/ReceiptModal.jsx << 'EOF'
import React from 'react';

export default function ReceiptModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
        <div id="receipt-print" className="p-6 text-center bg-white" dir="rtl">
          <h2 className="font-black text-xl text-black">دولمه فاكتوري</h2>
          <p className="text-xs text-gray-500">فرع الرياض</p>
          <div className="border-t border-dashed my-3"></div>
          <div className="text-right text-xs space-y-1 text-black">
            <div className="flex justify-between"><span>رقم الطلب:</span><b>#{order.order_number}</b></div>
            <div className="flex justify-between"><span>العميل:</span><b>{order.customer_name}</b></div>
            <div className="flex justify-between"><span>الجوال:</span><b dir="ltr">{order.customer_phone}</b></div>
            <div className="flex justify-between"><span>النوع:</span><b>{order.order_type === 'delivery' ? 'توصيل' : 'استلام'}</b></div>
          </div>
          <div className="border-t border-dashed my-3"></div>
          {(order.order_items || []).map((item, i) => (
            <div key={i} className="flex justify-between text-xs py-1 text-right text-black">
              <span>{item.product_name} {item.flavor_name && `(${item.flavor_name})`} - {item.variant_name}</span>
              <span>{item.quantity} × {item.unit_price} SR</span>
            </div>
          ))}
          <div className="border-t border-dashed my-3"></div>
          <div className="text-right text-xs space-y-1 text-black">
            <div className="flex justify-between"><span>المجموع:</span><b>{order.subtotal} SR</b></div>
            {order.delivery_fee > 0 && (
              <div className="flex justify-between"><span>التوصيل:</span><b>{order.delivery_fee} SR</b></div>
            )}
            {order.discount > 0 && (
              <div className="flex justify-between"><span>الخصم:</span><b>-{order.discount} SR</b></div>
            )}
          </div>
          <div className="border-t border-dashed my-3"></div>
          <div className="flex justify-between text-lg font-black text-black">
            <span>الإجمالي:</span><span>{order.total} SR</span>
          </div>
          <p className="text-xs text-gray-500 mt-4">شكراً لطلبكم 🌿</p>
        </div>
        <div className="p-3 border-t dark:border-gray-700 flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-teal-700 text-white py-3 rounded-lg font-bold"
          >
            🖨️ طباعة
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 dark:bg-gray-700 dark:text-white py-3 rounded-lg font-bold"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
EOF

# ============================================
# 3. AudioAlarmBanner.jsx
# ============================================
cat > src/features/branch/components/AudioAlarmBanner.jsx << 'EOF'
import React from 'react';

export default function AudioAlarmBanner({ hasNew, newCount, audioEnabled, onEnable }) {
  if (!hasNew) return null;

  if (audioEnabled) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-500 p-4 rounded-2xl mb-4 text-center animate-pulse">
        <p className="text-red-700 dark:text-red-300 font-black text-lg">
          🔔 {newCount} طلب جديد بانتظار القبول!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-500 p-4 rounded-2xl mb-4">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="text-2xl">⚠️</span>
        <p className="text-yellow-800 dark:text-yellow-200 font-black">
          الصوت غير مفعّل! اضغط "🔔 تفعيل التنبيه"
        </p>
        <button
          onClick={onEnable}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold text-sm"
        >
          تفعيل الآن
        </button>
      </div>
    </div>
  );
}
EOF

# ============================================
# 4. BranchApp.jsx (الرئيسي الجديد)
# ============================================
cat > src/features/branch/BranchApp.jsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { useOrders, useBranches, useDrivers } from '../../hooks/useSupabaseData';
import { updateOrderStatus } from '../../hooks/useOrdersApi';
import useAudioAlarm from '../../hooks/useAudioAlarm';
import { useToast } from '../../components/Toast';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import OrderCard from './components/OrderCard';
import ReceiptModal from './components/ReceiptModal';
import AudioAlarmBanner from './components/AudioAlarmBanner';

export default function BranchApp() {
  const toast = useToast();
  const isOnline = useOnlineStatus();
  const branches = useBranches();
  const [currentBranchId, setCurrentBranchId] = useState(null);
  const [printOrder, setPrintOrder] = useState(null);

  useEffect(() => {
    if (branches.length > 0 && !currentBranchId) setCurrentBranchId(branches[0].id);
  }, [branches, currentBranchId]);

  const { orders, loading } = useOrders(currentBranchId, true);
  const { drivers } = useDrivers(currentBranchId);

  const newOrders = orders.filter((o) => o.status === 'pending');
  const hasNew = newOrders.length > 0;
  const { initAudio, disableAudio, enabled: audioEnabled } = useAudioAlarm(hasNew);

  const handleStatus = async (orderId, status, driverId = null, driverName = null) => {
    try {
      await updateOrderStatus(orderId, status, driverId, driverName);
      toast.success('تم تحديث حالة الطلب');
    } catch (err) {
      toast.error('فشل تحديث حالة الطلب');
      console.error(err);
    }
  };

  const handleAssign = (orderId, driver) => {
    handleStatus(orderId, 'assigned', driver.id, driver.name);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400 dark:text-gray-500">
        ⏳ جاري تحميل الطلبات...
      </div>
    );
  }

  return (
    <div className="p-3 max-w-6xl mx-auto">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-red-500 text-white p-2 rounded-lg text-center text-xs font-bold mb-3">
          ⚠️ لا يوجد اتصال بالإنترنت — يعمل النظام على البيانات المحفوظة
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="text-lg font-black text-gray-800 dark:text-white">🖥️ شاشة الكاشير</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {orders.length} طلب نشط • {newOrders.length} جديد
          </p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {branches.length > 1 && (
            <select
              value={currentBranchId || ''}
              onChange={(e) => setCurrentBranchId(e.target.value)}
              className="text-xs bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 font-bold text-gray-800 dark:text-white"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          )}
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
                onClick={() => { disableAudio(); toast.info('تم إيقاف التنبيهات'); }}
                className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-2 rounded-lg text-xs"
              >
                🔕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Alarm Banner */}
      <AudioAlarmBanner
        hasNew={hasNew}
        newCount={newOrders.length}
        audioEnabled={audioEnabled}
        onEnable={() => initAudio()}
      />

      {/* Orders Grid */}
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

      {/* Empty */}
      {orders.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <p className="text-5xl mb-2">☕</p>
          <p>لا توجد طلبات نشطة حالياً</p>
        </div>
      )}

      {/* Receipt Modal */}
      {printOrder && (
        <ReceiptModal order={printOrder} onClose={() => setPrintOrder(null)} />
      )}
    </div>
  );
}
EOF

# ============================================
# 5. Re-export في المكان القديم
# ============================================
cat > src/components/BranchApp.jsx << 'EOF'
export { default } from '../features/branch/BranchApp';
EOF

echo ""
echo "✅ Sprint 4 Complete"
ls -la src/features/branch/
ls -la src/features/branch/components/
