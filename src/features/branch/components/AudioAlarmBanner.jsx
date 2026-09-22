import React from 'react';

export default function AudioAlarmBanner({ hasNew, newCount, audioEnabled, onEnable }) {
  if (!hasNew) return null;

  if (audioEnabled) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-500 p-4 rounded-2xl mb-4 text-center animate-pulse">
        <p className="text-red-700 dark:text-red-300 font-black text-lg">
          🔔 {newCount} طلب جديد بانتظار القبول!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-500 p-4 rounded-2xl mb-4">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="text-2xl">⚠️</span>
        <p className="text-yellow-800 dark:text-yellow-200 font-black">
          الصوت غير مفعّل! اضغط "🔔 تفعيل التنبيه"
        </p>
        <button
          onClick={onEnable}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold text-sm"
        >
          تفعيل الآن
        </button>
      </div>
    </div>
  );
}
