import React from 'react';

export default function DriverSelect({ drivers, onSelect }) {
  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center text-4xl">
          🛵
        </div>
        <h1 className="text-2xl font-black text-gray-800 dark:text-white mb-2">من أنت؟</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">اختر اسمك للبدء</p>
      </div>

      <div className="space-y-3">
        {drivers.map((d) => (
          <button
            key={d.id}
            onClick={() => onSelect(d)}
            className="w-full p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-400 transition-all text-right flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold text-lg">
              {d.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 dark:text-white">{d.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400" dir="ltr">{d.phone}</p>
            </div>
            <span className="text-gray-400">←</span>
          </button>
        ))}
      </div>
    </div>
  );
}
