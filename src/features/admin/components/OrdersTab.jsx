import React from 'react';
import { ORDER_STATUS_LABELS } from '../../../lib/constants';
import EmptyState from '../../../components/EmptyState';

export default function OrdersTab({ orders }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-black mb-4 text-gray-800 dark:text-white">
        سجل الطلبات ({orders.length})
      </h2>

      {orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="لا توجد طلبات بعد"
          description="عندما يطلب العملاء، ستظهر الطلبات هنا مباشرة."
        />
      ) : (
        <div className="space-y-2">
          {orders.map((o) => (
            <div
              key={o.id}
              className="flex items-center gap-3 p-3 border dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-gray-800 dark:text-white">
                    #{o.order_number}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {o.customer_name}
                  </span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                    {ORDER_STATUS_LABELS[o.status] || o.status}
                  </span>
                  {o.coupon_code && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 px-2 py-0.5 rounded">
                      🎁 {o.coupon_code}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {o.order_type === 'delivery' ? '🚗 توصيل' : '🏪 استلام'}
                  {' • '}
                  <span className="num-ltr">{new Date(o.created_at).toLocaleString('ar-SA')}</span>
                </p>
              </div>
              <div className="text-left flex-shrink-0">
                <b className="text-teal-700 dark:text-teal-400 text-sm num-ltr">
                  {o.total} SR
                </b>
                {o.discount > 0 && (
                  <p className="text-xs text-green-600 dark:text-green-400 num-ltr">
                    -{o.discount}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
