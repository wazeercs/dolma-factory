import React from 'react';

export default function DriverOrderCard({ order, onStartDelivery, onDeliver }) {
  const lng = order.delivery_location?.coordinates?.[0] || 46.6753;
  const lat = order.delivery_location?.coordinates?.[1] || 24.7136;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border-r-4 border-blue-500">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
            #{order.order_number}
          </span>
          <h4 className="font-bold text-gray-800 dark:text-white mt-2">{order.customer_name}</h4>
          <a
            href={`tel:${order.customer_phone}`}
            className="text-xs text-teal-600 dark:text-teal-400 font-bold"
            dir="ltr"
          >
            📞 {order.customer_phone}
          </a>
        </div>
        <div className="text-left">
          <p className="text-xs text-gray-400">
            {new Date(order.created_at).toLocaleTimeString('ar-SA', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className="font-black text-teal-700 dark:text-teal-400 text-lg">{order.total} SR</p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl mb-3 text-sm font-bold text-gray-700 dark:text-gray-200">
        {(order.order_items || []).map((item, i) => (
          <div key={i} className="py-0.5">
            {item.product_name}
            {item.flavor_name && ` (${item.flavor_name})`} - {item.variant_name} × {item.quantity}
          </div>
        ))}
      </div>

      {order.order_type === 'delivery' && order.delivery_address && (
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl mb-3 text-xs text-blue-800 dark:text-blue-200 flex gap-2">
          <span>📍</span>
          <span>{order.delivery_address}</span>
        </div>
      )}

      <div className="flex gap-2">
        {order.status === 'assigned' && (
          <button
            onClick={() => onStartDelivery(order.id)}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm"
          >
            🛵 بدء التوصيل
          </button>
        )}

        {order.status === 'out_for_delivery' && (
          <>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-bold text-sm text-center"
            >
              🗺️ الخريطة
            </a>
            <button
              onClick={() => onDeliver(order.id)}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold text-sm"
            >
              ✅ تم التسليم
            </button>
          </>
        )}
      </div>
    </div>
  );
}
