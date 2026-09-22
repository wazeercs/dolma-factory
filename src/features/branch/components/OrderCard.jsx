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
