import React from 'react';

export default function SearchBar({ value, onChange, placeholder = 'ابحث عن منتج...' }) {
  return (
    <div className="relative mb-3">
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
        <span className="text-gray-400 text-lg">🔍</span>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full py-3 pr-12 pl-10 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-teal-600 outline-none transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 left-3 flex items-center text-gray-400 hover:text-gray-600"
          aria-label="مسح البحث"
        >
          ✕
        </button>
      )}
    </div>
  );
}
