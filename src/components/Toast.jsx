import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

const VARIANTS = {
  success: {
    bg: 'bg-gradient-to-l from-green-500 to-emerald-600',
    icon: '✅',
    border: 'border-green-700',
  },
  error: {
    bg: 'bg-gradient-to-l from-red-500 to-rose-600',
    icon: '❌',
    border: 'border-red-700',
  },
  info: {
    bg: 'bg-gradient-to-l from-blue-500 to-indigo-600',
    icon: 'ℹ️',
    border: 'border-blue-700',
  },
  warning: {
    bg: 'bg-gradient-to-l from-amber-500 to-orange-600',
    icon: '⚠️',
    border: 'border-amber-700',
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]); // max 3 toasts

    if (duration > 0) {
      timersRef.current[id] = setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const toast = {
    success: (m, d) => addToast(m, 'success', d),
    error: (m, d) => addToast(m, 'error', d || 5000),
    info: (m, d) => addToast(m, 'info', d),
    warning: (m, d) => addToast(m, 'warning', d),
    clear: () => setToasts([]),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        dir="rtl"
        className="fixed top-3 left-3 right-3 z-[200] flex flex-col gap-2 max-w-md mx-auto pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => {
          const s = VARIANTS[t.type] || VARIANTS.info;
          return (
            <div
              key={t.id}
              role="alert"
              onClick={() => removeToast(t.id)}
              className={`${s.bg} text-white p-4 rounded-2xl shadow-2xl border-r-4 ${s.border} flex items-center gap-3 pointer-events-auto animate-slide-down cursor-pointer active:scale-95 transition-transform`}
            >
              <span className="text-2xl flex-shrink-0">{s.icon}</span>
              <span className="font-bold text-sm flex-1 leading-relaxed">{t.message}</span>
              <span className="text-white/70 text-lg flex-shrink-0">✕</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      success: (m) => console.log('✅', m),
      error: (m) => console.error('❌', m),
      info: (m) => console.log('ℹ️', m),
      warning: (m) => console.warn('⚠️', m),
      clear: () => {},
    };
  }
  return ctx;
}
