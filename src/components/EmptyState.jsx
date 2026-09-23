import React from 'react';

export default function EmptyState({
  icon = '📭',
  title = 'لا توجد بيانات',
  description = '',
  actionLabel = null,
  onAction = null,
  variant = 'default',
}) {
  const colors = {
    default: 'text-gray-400 dark:text-gray-500',
    error: 'text-red-500 dark:text-red-400',
    success: 'text-green-500 dark:text-green-400',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className={`text-6xl mb-4 ${colors[variant]}`}>{icon}</div>
      <h3 className="text-lg font-black text-gray-700 dark:text-gray-200 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-teal-700 text-white px-6 py-3 rounded-xl font-bold active:scale-95 transition-transform"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
