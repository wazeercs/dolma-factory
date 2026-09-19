#!/data/data/com.termux/files/usr/bin/bash

cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#0F766E" />
    <meta name="description" content="نظام طلبات وتوصيل دولمه فاكتوري" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="دولمه فاكتوري" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="https://api.dicebear.com/7.x/shapes/svg?seed=dolma&backgroundColor=0F766E" />
    <title>دولمه فاكتوري - نظام الطلبات</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

cat > src/main.jsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ToastProvider } from './components/Toast.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('SW registered:', reg.scope))
      .catch((err) => console.warn('SW registration failed:', err));
  });
}
EOF

cat > src/index.css << 'EOF'
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Cairo', sans-serif;
  background: #f8fafc;
  margin: 0;
  -webkit-tap-highlight-color: transparent;
}

.dark body { background: #111827; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up { animation: slideUp 0.3s ease-out; }

@keyframes slideDown {
  from { transform: translateY(-120%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-down { animation: slideDown 0.3s ease-out; }

@keyframes pulse-red {
  0%, 100% { background: #dc2626; }
  50% { background: #991b1b; }
}
.pulse-red { animation: pulse-red 1s infinite; }

@media print {
  body * { visibility: hidden; }
  #receipt-print, #receipt-print * { visibility: visible; }
  #receipt-print { position: absolute; top: 0; right: 0; width: 100%; }
}
EOF

cat > src/App.jsx << 'EOF'
import React, { useState } from 'react';
import CustomerApp from './components/CustomerApp';
import BranchApp from './components/BranchApp';
import AdminApp from './components/AdminApp';
import DriverApp from './components/DriverApp';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const [view, setView] = useState('customer');
  const { isDark, toggle } = useTheme();

  const tabs = [
    ['customer', '🛒 واجهة الزبون'],
    ['branch', '🖥️ شاشة الكاشير'],
    ['driver', '🛵 المناديب'],
    ['admin', '📊 لوحة الإدارة'],
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="bg-gray-900 dark:bg-black text-white p-2 flex justify-center gap-2 text-xs sticky top-0 z-40 flex-wrap items-center">
        {tabs.map(([k, l]) => (
          <button
            key={k}
            onClick={() => setView(k)}
            className={`px-3 py-2 rounded-lg font-bold transition-colors ${
              view === k ? 'bg-teal-600' : 'bg-gray-700 dark:bg-gray-800'
            }`}
          >
            {l}
          </button>
        ))}
        <button
          onClick={toggle}
          className="px-3 py-2 rounded-lg font-bold bg-gray-700 dark:bg-gray-800"
          title="تبديل الوضع الداكن"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
      <div className="pt-2">
        {view === 'customer' && <CustomerApp />}
        {view === 'branch' && <BranchApp />}
        {view === 'driver' && <DriverApp />}
        {view === 'admin' && <AdminApp />}
      </div>
    </div>
  );
}
EOF

cat > src/hooks/useAudioAlarm.js << 'EOF'
import { useEffect, useRef, useState } from 'react';

export default function useAudioAlarm(active) {
  const ctxRef = useRef(null);
  const oscRef = useRef(null);
  const intervalRef = useRef(null);
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem('dolma_alarm_enabled') === 'true'; }
    catch { return false; }
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (enabled && !ready) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!ctxRef.current) ctxRef.current = new AudioCtx();
        setReady(true);
      } catch (e) { console.warn('Audio init failed:', e); }
    }
  }, [enabled, ready]);

  const initAudio = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!ctxRef.current) ctxRef.current = new AudioCtx();
      if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
      const o = ctxRef.current.createOscillator();
      const g = ctxRef.current.createGain();
      g.gain.value = 0.001;
      o.connect(g); g.connect(ctxRef.current.destination);
      o.start(); o.stop(ctxRef.current.currentTime + 0.05);
      setEnabled(true); setReady(true);
      localStorage.setItem('dolma_alarm_enabled', 'true');
      return true;
    } catch (e) { console.error('Audio init error:', e); return false; }
  };

  const disableAudio = () => {
    setEnabled(false); setReady(false);
    localStorage.setItem('dolma_alarm_enabled', 'false');
  };

  useEffect(() => {
    if (!active || !ready || !enabled || !ctxRef.current) return;
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {
        setReady(false); setEnabled(false);
        localStorage.setItem('dolma_alarm_enabled', 'false');
      });
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 900;
    gain.gain.value = 0.15;
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); oscRef.current = osc;
    intervalRef.current = setInterval(() => {
      if (!oscRef.current) return;
      oscRef.current.frequency.setValueAtTime(900, ctx.currentTime);
      setTimeout(() => {
        if (oscRef.current) oscRef.current.frequency.setValueAtTime(500, ctx.currentTime);
      }, 200);
    }, 400);
    return () => {
      clearInterval(intervalRef.current);
      try { osc.stop(); osc.disconnect(); } catch (e) {}
      oscRef.current = null;
    };
  }, [active, ready, enabled]);

  return { initAudio, disableAudio, enabled, ready };
}
EOF

cat > src/hooks/useOrdersApi.js << 'EOF'
import { supabase } from '../lib/supabaseClient';

export async function createOrder(orderData, cartItems) {
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      branch_id: orderData.branchId,
      customer_name: orderData.customerName,
      customer_phone: orderData.customerPhone,
      order_type: orderData.orderType,
      delivery_location: orderData.deliveryLocation
        ? `POINT(${orderData.deliveryLocation.lng} ${orderData.deliveryLocation.lat})`
        : null,
      delivery_address: orderData.deliveryAddress,
      distance_km: orderData.distanceKm,
      subtotal: orderData.subtotal,
      delivery_fee: orderData.deliveryFee,
      discount: orderData.discount || 0,
      total: orderData.total,
      payment_method: orderData.paymentMethod,
      idempotency_key: orderData.idempotencyKey,
      coupon_id: orderData.couponId || null,
      coupon_code: orderData.couponCode || null,
      notes: orderData.notes,
    })
    .select()
    .single();
  if (orderErr) throw orderErr;

  const items = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    flavor_name: item.flavorName,
    variant_name: item.variantName,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.unitPrice * item.quantity,
  }));
  const { error: itemsErr } = await supabase.from('order_items').insert(items);
  if (itemsErr) throw itemsErr;
  return order;
}

export async function updateOrderStatus(orderId, newStatus, driverId = null, driverName = null) {
  const updates = { status: newStatus };
  if (driverId) updates.driver_id = driverId;
  if (driverName) updates.driver_name = driverName;
  const { data, error } = await supabase.from('orders').update(updates).eq('id', orderId).select().single();
  if (error) throw error;
  return data;
}

export async function getNearestBranch(lat, lng) {
  const { data, error } = await supabase.rpc('get_nearest_branch', { cust_lat: lat, cust_lng: lng });
  if (error) throw error;
  return data?.[0] || null;
}

export async function toggleProductStock(productId, inStock) {
  return supabase.from('products').update({ in_stock: inStock }).eq('id', productId);
}

export async function updateVariantPrice(variantId, price) {
  return supabase.from('product_variants').update({ price }).eq('id', variantId);
}

export async function toggleDriverAvailability(driverId, isAvailable) {
  return supabase.from('drivers').update({ is_available: isAvailable }).eq('id', driverId);
}
EOF

echo ""
echo "✅ تم تحديث 6 ملفات أساسية!"
echo ""
ls -la src/hooks/ | grep -E "useAudioAlarm|useOrdersApi"
