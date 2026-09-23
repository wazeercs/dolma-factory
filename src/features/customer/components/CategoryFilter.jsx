import React from 'react';

export default function CategoryFilter({ categories, active, onChange }) {
  const all = [['all', '🍽️ الكل'], ...categories];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-3 no-scrollbar">
      {all.map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(key === 'all' ? null : key)}
          className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
            (key === 'all' && !active) || active === key
              ? 'bg-teal-700 text-white shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
