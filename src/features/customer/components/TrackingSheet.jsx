import React from 'react';

const STATUS_STEPS = [
  { key: 'new', label: 'تم الاستلام', icon: '📝' },
  { key: 'preparing', label: 'قيد التحضير', icon: '👨‍🍳' },
  { key: 'ready', label: 'جاهز', icon: '✅' },
  { key: 'on_way', label: 'في الطريق', icon: '🛵' },
  { key: 'delivered', label: 'تم التسليم', icon: '🎉' },
];

export default function TrackingSheet({ order, onClose }) {
  if (!order) return null;

  const currentStepIdx = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-end justify-center">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-t-3xl max-h-[92vh] flex flex-col animate-slide-up">
        <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-800 dark:text-white">
            تتبع الطلب #{order.order_number}
          </h2>
          <button onClick={onClose} className="text-2xl text-gray-700 dark:text-gray-200">✕</button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 no-scrollbar">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center text-4xl mb-3">
              {STATUS_STEPS[currentStepIdx]?.icon}
            </div>
            <h3 className="text-xl font-black text-gray-800 dark:text-white">
              {STATUS_STEPS[currentStepIdx]?.label}
            </h3>
          </div>

          <div className="relative mb-8">
            <div className="absolute top-5 right-5 left-5 h-1 bg-gray-200 dark:bg-gray-700"></div>
            <div
              className="absolute top-5 right-5 h-1 bg-teal-600 transition-all duration-500"
              style={{ width: `calc(${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}% - 0px)` }}
            ></div>
            <div className="relative flex justify-between">
              {STATUS_STEPS.map((step, i) => (
                <div key={step.key} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                      i <= currentStepIdx
                        ? 'bg-teal-600 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    }`}
                  >
                    {i < currentStepIdx ? '✓' : step.icon}
                  </div>
                  <span
                    className={`text-xs mt-2 font-bold ${
                      i <= currentStepIdx ? 'text-teal-700 dark:text-teal-400' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 mb-4">
            <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-3">تفاصيل الطلب:</h4>
            {(order.order_items || []).map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-sm py-1.5 border-b border-gray-200 dark:border-gray-600 last:border-0 text-gray-800 dark:text-gray-200"
              >
                <span>
                  {item.product_name}
                  {item.flavor_name && ` (${item.flavor_name})`} - {item.variant_name} × {item.quantity}
                </span>
                <b>{item.total_price} SR</b>
              </div>
            ))}
            {order.discount > 0 && (
              <div className="flex justify-between text-sm py-1.5 text-green-600 dark:text-green-400 border-t border-gray-200 dark:border-gray-600">
                <span>الخصم</span>
                <b>-{order.discount} SR</b>
              </div>
            )}
            <div className="flex justify-between font-black text-lg pt-2 mt-2 border-t dark:border-gray-600 text-gray-800 dark:text-white">
              <span>الإجمالي</span>
              <span className="text-teal-700 dark:text-teal-400">{order.total} SR</span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-3 text-xs text-blue-800 dark:text-blue-200">
            ℹ️ الحالة تُحدَّث تلقائياً من الكاشير لحظة بلحظة.
          </div>
        </div>
      </div>
    </div>
  );
}
