import React from 'react';

const TABS = [
  { key: 'home', icon: '🏠', label: 'الرئيسية' },
  { key: 'cart', icon: '🛒', label: 'السلة' },
  { key: 'tracking', icon: '📦', label: 'طلبي' },
  { key: 'loyalty', icon: '🎁', label: 'نقاطي' },
];

export default function BottomNav({ active, onChange, cartCount = 0, hasTracking = false }) {
  return (
    <nav
      dir="rtl"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl"
      aria-label="التنقل الرئيسي"
    >
      <div className="max-w-lg mx-auto flex justify-around items-center py-2 pb-safe">
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          const showBadge = tab.key === 'cart' && cartCount > 0;
          const showDot = tab.key === 'tracking' && hasTracking;

          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all active:scale-95 ${
                isActive
                  ? 'text-teal-700 dark:text-teal-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <span className="text-2xl" aria-hidden="true">
                {tab.icon}
              </span>
              <span className={`text-[10px] font-bold ${isActive ? 'font-black' : ''}`}>
                {tab.label}
              </span>

              {showBadge && (
                <span
                  className="absolute top-1 left-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center num-ltr"
                  aria-label={`${cartCount} عنصر في السلة`}
                >
                  {cartCount}
                </span>
              )}

              {showDot && (
                <span
                  className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  aria-label="طلب نشط"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
