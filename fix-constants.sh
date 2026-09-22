#!/data/data/com.termux/files/usr/bin/bash
set -e

# ═══════════════════════════════════════════
# إصلاح constants.js — إضافة كل الصادرات
# ═══════════════════════════════════════════
cat > src/lib/constants.js << 'EOF'
// ═══════════════════════════════════════════
// الأدوار
// ═══════════════════════════════════════════
export const ROLES = {
  CUSTOMER: 'customer',
  CASHIER: 'cashier',
  BRANCH_MANAGER: 'branch_manager',
  DRIVER: 'driver',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

export const ROLE_LABELS = {
  customer: 'زبون',
  cashier: 'كاشير',
  branch_manager: 'مدير فرع',
  driver: 'مندوب',
  admin: 'إدارة',
  super_admin: 'إدارة عليا',
};

// ═══════════════════════════════════════════
// حالات الطلب
// ═══════════════════════════════════════════
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY_FOR_DELIVERY: 'ready_for_delivery',
  ASSIGNED: 'assigned',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
};

export const ORDER_STATUS_LABELS = {
  pending: 'بانتظار التأكيد',
  confirmed: 'مؤكد',
  preparing: 'قيد التحضير',
  ready_for_delivery: 'جاهز للتوصيل',
  assigned: 'مسند لمندوب',
  out_for_delivery: 'في الطريق',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
  rejected: 'مرفوض',
};

export const ORDER_STATUS_COLORS = {
  pending: 'border-gray-400',
  confirmed: 'border-blue-500',
  preparing: 'border-yellow-500',
  ready_for_delivery: 'border-orange-500',
  assigned: 'border-purple-500',
  out_for_delivery: 'border-teal-500',
  delivered: 'border-green-500',
  cancelled: 'border-red-500',
  rejected: 'border-red-700',
};

// ═══════════════════════════════════════════
// الانتقالات المسموحة
// ═══════════════════════════════════════════
export const ALLOWED_TRANSITIONS = {
  pending: ['confirmed', 'rejected', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready_for_delivery', 'cancelled'],
  ready_for_delivery: ['assigned', 'cancelled'],
  assigned: ['out_for_delivery', 'ready_for_delivery'],
  out_for_delivery: ['delivered', 'ready_for_delivery'],
  delivered: [],
  cancelled: [],
  rejected: [],
};

// ═══════════════════════════════════════════
// حالات الاتصال
// ═══════════════════════════════════════════
export const CONNECTION_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  RECONNECTING: 'reconnecting',
  SUBSCRIBED: 'subscribed',
  CHANNEL_ERROR: 'channel_error',
  TIMED_OUT: 'timed_out',
  CLOSED: 'closed',
};
EOF

# ═══════════════════════════════════════════
# إصلاح package.json — Node 24
# ═══════════════════════════════════════════
cat > package.json << 'EOF'
{
  "name": "dolma-factory",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "engines": {
    "node": "24.x"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "postinstall": "npm rebuild esbuild --silent || true"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "vite": "^5.3.1"
  }
}
EOF

# ═══════════════════════════════════════════
# إصلاح vercel.json — إعدادات صريحة
# ═══════════════════════════════════════════
cat > vercel.json << 'EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/((?!api/|.*\\..*).*)", "destination": "/index.html" }
  ]
}
EOF

echo ""
echo "✅ Constants + Package + Vercel config fixed"
echo ""
echo "═══ عدد الصادرات في constants.js ═══"
grep "^export" src/lib/constants.js | wc -l

echo ""
echo "═══ تأكيد ORDER_STATUS_COLORS ═══"
grep "ORDER_STATUS_COLORS" src/lib/constants.js

echo ""
echo "═══ تأكيد Node 24 ═══"
grep "node" package.json
