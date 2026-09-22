import React from 'react';

export default function CartSheet({ cart, cartTotal, onClose, onRemove, onCheckout }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-t-3xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-800 dark:text-white">سلة المشتريات</h2>
          <button onClick={onClose} className="text-2xl text-gray-700 dark:text-gray-200">✕</button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 no-scrollbar">
          {cart.map((item, i) => (
            <div key={i} className="flex gap-3 mb-4 pb-4 border-b dark:border-gray-700">
              <img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt="" />
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 dark:text-white">{item.productName}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.flavorName && `${item.flavorName} • `}
                  {item.variantName}
                </p>
                <p className="text-sm font-bold text-teal-700 dark:text-teal-400 mt-1">
                  {item.quantity} × {item.unitPrice} = {item.unitPrice * item.quantity} SR
                </p>
              </div>
              <button onClick={() => onRemove(i)} className="text-red-500 text-sm font-bold">
                حذف
              </button>
            </div>
          ))}
        </div>

        <div className="p-5 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between font-black text-lg mb-4 text-gray-800 dark:text-white">
            <span>الإجمالي:</span>
            <span className="text-teal-700 dark:text-teal-400">{cartTotal} SR</span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full bg-teal-700 text-white py-4 rounded-xl font-black shadow-lg"
          >
            متابعة الطلب
          </button>
        </div>
      </div>
    </div>
  );
}
