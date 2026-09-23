import React, { useState, useEffect } from 'react';

export default function RamadanBanner({ onClose }) {
  const [visible, setVisible] = useState(() => {
    return localStorage.getItem('dolma_ramadan_banner_dismissed') !== 'true';
  });

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('dolma_ramadan_banner_dismissed', 'true');
  };

  if (!visible) return null;

  return (
    <div className="relative bg-gradient-to-l from-amber-500 via-yellow-500 to-amber-500 text-white rounded-2xl p-4 mb-4 shadow-lg overflow-hidden animate-fade-in">
      {/* زخرفة */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-x-8 -translate-y-8" />
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 rounded-full translate-x-6 translate-y-6" />

      <button
        onClick={handleDismiss}
        className="absolute top-2 left-2 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold hover:bg-white/30"
        aria-label="إغلاق"
      >
        ✕
      </button>

      <div className="relative flex items-center gap-3">
        <div className="text-4xl">🌙</div>
        <div className="flex-1">
          <h3 className="font-black text-lg mb-1">رمضان كريم</h3>
          <p className="text-xs opacity-90">
            نقدم لكم وجبات الإفطار والسحور في جميع فروعنا
          </p>
          <p className="text-xs font-bold mt-1 opacity-95">
            🌟 خصم 15% على الطلبات فوق 100 ريال
          </p>
        </div>
      </div>
    </div>
  );
}
