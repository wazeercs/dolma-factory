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
