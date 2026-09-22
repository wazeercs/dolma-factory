import React from 'react';

export default function ProductsTab({ products, onToggleStock, onUpdatePrice }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-black mb-4 text-gray-800 dark:text-white">
        إدارة المنتجات والأسعار
      </h2>

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="border dark:border-gray-700 rounded-xl p-3">
            <div className="flex items-center gap-3 mb-3">
              <img src={p.image_url} className="w-14 h-14 rounded-lg object-cover" alt="" />
              <div className="flex-1">
                <h4 className="font-bold text-sm text-gray-800 dark:text-white">{p.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{p.category}</p>
              </div>
              <button
                onClick={() => onToggleStock(p.id, p.in_stock)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  p.in_stock
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                }`}
              >
                {p.in_stock ? '✓ متوفر' : '✗ نافذ'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(p.variants || []).map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-2 py-1"
                >
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{v.name}:</span>
                  <input
                    type="number"
                    defaultValue={v.price}
                    onBlur={(e) => onUpdatePrice(v.id, e.target.value)}
                    className="w-16 text-xs font-bold text-teal-700 dark:text-teal-400 bg-transparent border-b border-teal-300 dark:border-teal-600 outline-none text-center"
                  />
                  <span className="text-xs text-gray-700 dark:text-gray-200">SR</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
