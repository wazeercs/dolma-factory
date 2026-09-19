#!/data/data/com.termux/files/usr/bin/bash

mkdir -p public src/components src/hooks src/lib

cat > tailwind.config.js << 'EOF'
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: { extend: {} },
  plugins: [],
};
EOF

cat > public/manifest.json << 'EOF'
{
  "name": "دولمه فاكتوري - نظام الطلبات",
  "short_name": "دولمه فاكتوري",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F766E",
  "theme_color": "#0F766E",
  "dir": "rtl",
  "lang": "ar",
  "icons": [
    {"src": "https://api.dicebear.com/7.x/shapes/svg?seed=dolma&backgroundColor=0F766E", "sizes": "192x192", "type": "image/svg+xml"},
    {"src": "https://api.dicebear.com/7.x/shapes/svg?seed=dolma&backgroundColor=0F766E", "sizes": "512x512", "type": "image/svg+xml"}
  ]
}
EOF

cat > public/sw.js << 'EOF'
const CACHE_NAME = 'dolma-v2';
const ASSETS = ['/', '/index.html', '/manifest.json'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('supabase.co')) return;
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(caches.match(e.request).then((cached) => {
    const network = fetch(e.request).then((res) => {
      if (res.ok) caches.open(CACHE_NAME).then((c) => c.put(e.request, res.clone()));
      return res;
    }).catch(() => cached);
    return cached || network;
  }));
});
EOF

cat > src/hooks/useTheme.js << 'EOF'
import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('dolma_theme') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('dolma_theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  return { theme, toggle, isDark: theme === 'dark' };
}
EOF

cat > src/hooks/useCoupons.js << 'EOF'
import { supabase } from '../lib/supabaseClient';

export async function validateCoupon(code, subtotal, branchId) {
  const { data, error } = await supabase.rpc('validate_coupon', {
    p_code: code.trim(),
    p_subtotal: subtotal,
    p_branch_id: branchId,
  });
  if (error) throw error;
  const r = data?.[0];
  return {
    valid: r?.valid || false,
    couponId: r?.coupon_id || null,
    discountAmount: Number(r?.discount_amount || 0),
    message: r?.message || 'خطأ غير معروف',
  };
}
EOF

cat > src/components/Toast.jsx << 'EOF'
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
EOF

echo ""
echo "✅ تم إنشاء 6 ملفات بنجاح!"
echo ""
ls -la public/
echo ""
ls -la src/hooks/
echo ""
ls -la src/components/
