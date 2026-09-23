import React from 'react';
import WhatsAppShare from './WhatsAppShare';

const STATUS_STEPS = [
  { key: 'pending', label: 'تم الاستلام', icon: '📝' },
  { key: 'confirmed', label: 'مؤكد', icon: '✅' },
  { key: 'preparing', label: 'قيد التحضير', icon: '👨‍🍳' },
  { key: 'ready_for_delivery', label: 'جاهز', icon: '📦' },
  { key: 'assigned', label: 'مسند للمندوب', icon: '🛵' },
  { key: 'out_for_delivery', label: 'في الطريق', icon: '🚗' },
  { key: 'delivered', label: 'تم التسليم', icon: '🎉' },
];

const STATUS_MESSAGES = {
  pending: 'تم استلام طلبك، في انتظار التأكيد',
  confirmed: 'تم تأكيد طلبك',
  preparing: 'جاري تحضير طلبك بعناية',
  ready_for_delivery: 'طلبك جاهز',
  assigned: 'تم تعيين مندوب لطلبك',
  out_for_delivery: 'المندوب في الطريق إليك',
  delivered: 'بالهناء والشفاء! 🎉',
  cancelled: 'تم إلغاء الطلب',
  rejected: 'تم رفض الطلب',
};

export default function TrackingSheet({ order, onClose }) {
  if (!order) return null;

  // إيجاد الخطوة الحالية (لو الحالة ملغاة أو مرفوضة، نعرض بطاقة خاصة)
  const isCancelled = order.status === 'cancelled' || order.status === 'rejected';
  const currentStepIdx = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const activeStepIdx = isCancelled ? 0 : currentStepIdx;

  const trackUrl = `https://dolma-factory-3fo2.vercel.app/?track=${order.order_number}`;

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-end justify-center">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-t-3xl max-h-[92vh] flex flex-col animate-slide-up">

        {/* ═══ Header ═══ */}
        <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-800 dark:text-white">
            تتبع الطلب #{order.order_number}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-9 h-9 rounded-full"
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        {/* ═══ Content ═══ */}
        <div className="p-5 overflow-y-auto flex-1 no-scrollbar">

          {/* ═══ حالة الإلغاء (لو موجودة) ═══ */}
          {isCancelled ? (
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-5xl mb-4">
                ❌
              </div>
              <h3 className="text-2xl font-black text-red-700 dark:text-red-300 mb-2">
                {order.status === 'cancelled' ? 'تم إلغاء الطلب' : 'تم رفض الطلب'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                للاستفسار، يرجى التواصل مع الفرع
              </p>
            </div>
          ) : (
            <>
              {/* ═══ الحالة الحالية ═══ */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto bg-teal-100 dark:bg-teal-900/40 rounded-full flex items-center justify-center text-5xl mb-3 animate-pulse">
                  {STATUS_STEPS[activeStepIdx]?.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-800 dark:text-white">
                  {STATUS_STEPS[activeStepIdx]?.label}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  {STATUS_MESSAGES[order.status]}
                </p>
              </div>

              {/* ═══ شريط التقدم ═══ */}
              <div className="relative mb-8 px-2">
                {/* الخط الخلفي */}
                <div className="absolute top-5 right-5 left-5 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />

                {/* الخط الملوّن */}
                <div
                  className="absolute top-5 right-5 h-1 bg-gradient-to-l from-teal-600 to-teal-400 transition-all duration-700 rounded-full"
                  style={{
                    width: activeStepIdx === 0
                      ? '0%'
                      : `calc(${(activeStepIdx / (STATUS_STEPS.length - 1)) * 100}% - 0px)`,
                  }}
                />

                {/* النقاط */}
                <div className="relative flex justify-between">
                  {STATUS_STEPS.map((step, i) => {
                    const isDone = i < activeStepIdx;
                    const isCurrent = i === activeStepIdx;
                    return (
                      <div key={step.key} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                            isDone
                              ? 'bg-teal-600 text-white shadow-lg'
                              : isCurrent
                              ? 'bg-teal-600 text-white shadow-lg ring-4 ring-teal-200 dark:ring-teal-900'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                          }`}
                        >
                          {isDone ? '✓' : step.icon}
                        </div>
                        <span
                          className={`text-[10px] mt-2 font-bold text-center leading-tight ${
                            i <= activeStepIdx
                              ? 'text-teal-700 dark:text-teal-400'
                              : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ═══ تفاصيل الطلب ═══ */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 mb-4">
            <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
              🧾 تفاصيل الطلب
            </h4>

            <div className="space-y-1">
              {(order.order_items || []).map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm py-2 border-b border-gray-200 dark:border-gray-600 last:border-0 text-gray-800 dark:text-gray-200"
                >
                  <span className="flex-1">
                    <span className="font-bold">{item.product_name}</span>
                    {item.flavor_name && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {' '}({item.flavor_name})
                      </span>
                    )}
                    <br />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.variant_name} × {item.quantity}
                    </span>
                  </span>
                  <b className="num-ltr">{item.total_price} SR</b>
                </div>
              ))}
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-sm py-2 text-green-600 dark:text-green-400 border-t border-gray-200 dark:border-gray-600">
                <span>🎁 الخصم</span>
                <b className="num-ltr">-{order.discount} SR</b>
              </div>
            )}

            <div className="flex justify-between font-black text-lg pt-3 mt-2 border-t-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white">
              <span>الإجمالي</span>
              <span className="text-teal-700 dark:text-teal-400 num-ltr">
                {order.total} SR
              </span>
            </div>
          </div>

          {/* ═══ WhatsApp Share ═══ */}
          <div className="mb-4">
            <WhatsAppShare
              orderNumber={order.order_number}
              total={order.total}
              trackUrl={trackUrl}
            />
          </div>

          {/* ═══ Info Box ═══ */}
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-3 text-xs text-blue-800 dark:text-blue-200 text-center">
            ℹ️ الحالة تُحدَّث تلقائياً من الكاشير لحظة بلحظة
          </div>

        </div>
      </div>
    </div>
  );
}
