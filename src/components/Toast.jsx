import React, { createContext, useContext, useState, useCallback } from 'react';
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), duration);
  }, []);
  const removeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));
  const toast = {
    success: (m, d) => addToast(m, 'success', d),
    error: (m, d) => addToast(m, 'error', d || 5000),
    info: (m, d) => addToast(m, 'info', d),
    warning: (m, d) => addToast(m, 'warning', d),
  };
  const styles = {
    success: { bg: 'bg-green-500', icon: '✅' },
    error: { bg: 'bg-red-500', icon: '❌' },
    info: { bg: 'bg-blue-500', icon: 'ℹ️' },
    warning: { bg: 'bg-yellow-500', icon: '⚠️' },
  };
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 left-4 right-4 z-[100] flex flex-col gap-2 max-w-md mx-auto pointer-events-none">
        {toasts.map((t) => {
          const s = styles[t.type] || styles.info;
          return (
            <div key={t.id} onClick={() => removeToast(t.id)} className={`${s.bg} text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto animate-slide-down cursor-pointer`}>
              <span className="text-2xl">{s.icon}</span>
              <span className="font-bold text-sm flex-1">{t.message}</span>
              <span className="text-white/70 text-lg">✕</span>
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
    };
  }
  return ctx;
}
