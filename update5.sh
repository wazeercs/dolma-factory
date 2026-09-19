#!/data/data/com.termux/files/usr/bin/bash

cat > src/components/BranchApp.jsx << 'BRANCHEOF'
import React, { useState, useEffect } from 'react';
import { useOrders, useBranches, useDrivers } from '../hooks/useSupabaseData';
import { updateOrderStatus } from '../hooks/useOrdersApi';
import useAudioAlarm from '../hooks/useAudioAlarm';
import { useToast } from './Toast';

export default function BranchApp() {
  const toast = useToast();
  const branches = useBranches();
  const [currentBranchId, setCurrentBranchId] = useState(null);

  useEffect(() => {
    if (branches.length > 0 && !currentBranchId) setCurrentBranchId(branches[0].id);
  }, [branches, currentBranchId]);

  const { orders, loading } = useOrders(currentBranchId, true);
  const drivers = useDrivers(currentBranchId);
  const [printOrder, setPrintOrder] = useState(null);

  const hasNew = orders.some((o) => o.status === 'new');
  const { initAudio, disableAudio, enabled: audioEnabled } = useAudioAlarm(hasNew);

  const handleStatus = async (orderId, status, driverId, driverName) => {
    try {
      await updateOrderStatus(orderId, status, driverId || null, driverName || null);
      toast.success('تم تحديث حالة الطلب');
    } catch (err) {
      toast.error('فشل تحديث حالة الطلب');
      console.error(err);
    }
  };

  const statusLabels = { new: 'جديد', preparing: 'قيد التحضير', ready: 'جاهز', on_way: 'في الطريق', delivered: 'تم التسليم' };
  const statusColors = { new: 'border-red-500', preparing: 'border-yellow-500', ready: 'border-green-500', on_way: 'border-blue-500', delivered: 'border-gray-300 dark:border-gray-600' };

  if (loading) {
    return <div className="p-8 text-center text-gray-400 dark:text-gray-500">⏳ جاري تحميل الطلبات...</div>;
  }

  return (
    <div className="p-3 max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="text-lg font-black text-gray-800 dark:text-white">🖥️ شاشة الكاشير</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">{orders.length} طلب نشط • {orders.filter((o) => o.status === 'new').length} جديد</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {branches.length > 1 && (
            <select value={currentBranchId || ''} onChange={(e) => setCurrentBranchId(e.target.value)} className="text-xs bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 font-bold text-gray-800 dark:text-white">
              {branches.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))}
            </select>
          )}
          {!audioEnabled ? (
            <button onClick={() => { const ok = initAudio(); if (ok) toast.success('تم تفعيل التنبيهات 🔔'); else toast.error('فشل تفعيل الصوت'); }} className="pulse-red text-white px-4 py-2 rounded-lg font-bold text-sm">
              🔔 تفعيل التنبيه
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-lg font-bold text-xs">✅ التنبيهات مفعلة</span>
              <button onClick={() => { disableAudio(); toast.info('تم إيقاف التنبيهات'); }} className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-2 rounded-lg text-xs" title="إيقاف">🔕</button>
            </div>
          )}
        </div>
      </div>

      {hasNew && (
        <div className={'p-4 rounded-2xl mb-4 text-center ' + (audioEnabled ? 'bg-red-50 dark:bg-red-900/30 border-2 border-red-500 animate-pulse' : 'bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-500')}>
          {audioEnabled ? (
            <p className="text-red-700 dark:text-red-300 font-black text-lg">🔔 {orders.filter((o) => o.status === 'new').length} طلب جديد بانتظار القبول!</p>
          ) : (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-2xl">⚠️</span>
              <p className="text-yellow-800 dark:text-yellow-200 font-black">الصوت غير مفعّل! اضغط "🔔 تفعيل التنبيه"</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {orders.map((o) => (
          <div key={o.id} className={'bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border-r-4 ' + statusColors[o.status]}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">#{o.order_number}</span>
                  <span className={'text-xs font-bold px-2 py-1 rounded ' + (o.status === 'new' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : o.status === 'preparing' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' : o.status === 'ready' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : o.status === 'on_way' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300')}>{statusLabels[o.status]}</span>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{o.payment_method === 'cash' ? '💵' : '💳'}</span>
                  {o.coupon_code && (<span className="text-xs font-bold px-2 py-1 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">🎁 {o.coupon_code}</span>)}
                </div>
                <h3 className="font-bold text-base mt-2 text-gray-800 dark:text-white">{o.customer_name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400" dir="ltr">{o.customer_phone}</p>
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-teal-700 dark:text-teal-400 block">{o.order_type === 'delivery' ? '🚗 توصيل' : '🏪 استلام'}</span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl mb-3 text-sm font-bold text-gray-700 dark:text-gray-200">
              {(o.order_items || []).map((item, i) => (
                <div key={i} className="py-0.5">
                  {item.product_name}{item.flavor_name && ' (' + item.flavor_name + ')'} - {item.variant_name} × {item.quantity}
                </div>
              ))}
              {o.driver_name && (<div className="text-xs text-blue-600 dark:text-blue-400 mt-2">🛵 المندوب: {o.driver_name}</div>)}
            </div>

            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <span className="font-black text-lg text-teal-700 dark:text-teal-400">{o.total} SR</span>
                {o.discount > 0 && (<span className="text-xs text-green-600 dark:text-green-400 mr-2">(خصم {o.discount})</span>)}
              </div>
              <div className="flex gap-1 flex-wrap">
                <button onClick={() => setPrintOrder(o)} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg font-bold text-xs">🖨️</button>
                {o.status === 'new' && (<button onClick={() => handleStatus(o.id, 'preparing')} className="bg-teal-600 text-white px-4 py-2 rounded-lg font-bold text-xs">قبول</button>)}
                {o.status === 'preparing' && (<button onClick={() => handleStatus(o.id, 'ready')} className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold text-xs">جاهز</button>)}
                {o.status === 'ready' && (
                  <select onChange={(e) => { const driverId = e.target.value; if (!driverId) return; const d = drivers.find((x) => x.id === driverId); if (d) handleStatus(o.id, 'on_way', d.id, d.name); }} className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-xs">
                    <option value="">تعيين مندوب</option>
                    {drivers.filter((d) => d.is_available).map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
                  </select>
                )}
                {o.status === 'on_way' && (<button onClick={() => handleStatus(o.id, 'delivered')} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-xs">تم التسليم</button>)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <p className="text-5xl mb-2">☕</p>
          <p>لا توجد طلبات نشطة حالياً</p>
        </div>
      )}

      {printOrder && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
            <div id="receipt-print" className="p-6 text-center bg-white" dir="rtl">
              <h2 className="font-black text-xl text-black">دولمه فاكتوري</h2>
              <p className="text-xs text-gray-500">فرع الرياض</p>
              <div className="border-t border-dashed my-3"></div>
              <div className="text-right text-xs space-y-1 text-black">
                <div className="flex justify-between"><span>رقم الطلب:</span><b>#{printOrder.order_number}</b></div>
                <div className="flex justify-between"><span>العميل:</span><b>{printOrder.customer_name}</b></div>
                <div className="flex justify-between"><span>الجوال:</span><b dir="ltr">{printOrder.customer_phone}</b></div>
                <div className="flex justify-between"><span>النوع:</span><b>{printOrder.order_type === 'delivery' ? 'توصيل' : 'استلام'}</b></div>
              </div>
              <div className="border-t border-dashed my-3"></div>
              {(printOrder.order_items || []).map((item, i) => (
                <div key={i} className="flex justify-between text-xs py-1 text-right text-black">
                  <span>{item.product_name} {item.flavor_name && '(' + item.flavor_name + ')'} - {item.variant_name}</span>
                  <span>{item.quantity} × {item.unit_price} SR</span>
                </div>
              ))}
              <div className="border-t border-dashed my-3"></div>
              <div className="text-right text-xs space-y-1 text-black">
                <div className="flex justify-between"><span>المجموع:</span><b>{printOrder.subtotal} SR</b></div>
                {printOrder.delivery_fee > 0 && (<div className="flex justify-between"><span>التوصيل:</span><b>{printOrder.delivery_fee} SR</b></div>)}
                {printOrder.discount > 0 && (<div className="flex justify-between"><span>الخصم:</span><b>-{printOrder.discount} SR</b></div>)}
              </div>
              <div className="border-t border-dashed my-3"></div>
              <div className="flex justify-between text-lg font-black text-black">
                <span>الإجمالي:</span><span>{printOrder.total} SR</span>
              </div>
              <p className="text-xs text-gray-500 mt-4">شكراً لطلبكم 🌿</p>
            </div>
            <div className="p-3 border-t dark:border-gray-700 flex gap-2">
              <button onClick={() => window.print()} className="flex-1 bg-teal-700 text-white py-3 rounded-lg font-bold">🖨️ طباعة</button>
              <button onClick={() => setPrintOrder(null)} className="flex-1 bg-gray-200 dark:bg-gray-700 dark:text-white py-3 rounded-lg font-bold">إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
BRANCHEOF

echo "✅ BranchApp.jsx تم"
