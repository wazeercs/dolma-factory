import React from 'react';

export default function DriversTab({ drivers }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-black mb-4 text-gray-800 dark:text-white">إدارة المناديب</h2>

      {drivers.map((d) => (
        <div
          key={d.id}
          className="flex items-center gap-3 p-3 border dark:border-gray-700 rounded-xl mb-2"
        >
          <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">
            🛵
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-gray-800 dark:text-white">{d.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400" dir="ltr">{d.phone}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              🚚 {d.total_deliveries} توصيلة
            </p>
          </div>
          <span
            className={`px-2 py-1 rounded text-xs font-bold ${
              d.is_available
                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
            }`}
          >
            {d.is_available ? 'متاح' : 'مشغول'}
          </span>
        </div>
      ))}
    </div>
  );
}
