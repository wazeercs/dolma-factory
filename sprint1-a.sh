#!/data/data/com.termux/files/usr/bin/bash
set -e

mkdir -p src/app/router src/features/auth src/lib

# ============================================
# src/lib/constants.js
# ============================================
cat > src/lib/constants.js << 'EOF'
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

# ============================================
# src/lib/permissions.js
# ============================================
cat > src/lib/permissions.js << 'EOF'
import { ROLES } from './constants.js';

export function canAccessRoute(role, route) {
  if (!role) return false;

  const routePermissions = {
    '/': 'public',
    '/login': 'public',
    '/cashier': [ROLES.CASHIER, ROLES.BRANCH_MANAGER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
    '/admin': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
    '/driver': [ROLES.DRIVER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  };

  const required = routePermissions[route];
  if (!required) return true;
  if (required === 'public') return true;
  return required.includes(role);
}

export function isAdmin(role) {
  return [ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role);
}

export function canManageOrders(role) {
  return [ROLES.CASHIER, ROLES.BRANCH_MANAGER, ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role);
}

export function canViewBranchOrders(role) {
  return [ROLES.CASHIER, ROLES.BRANCH_MANAGER, ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role);
}

export function canManageDrivers(role) {
  return [ROLES.BRANCH_MANAGER, ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role);
}

export function getHomeRouteForRole(role) {
  switch (role) {
    case ROLES.CASHIER:
    case ROLES.BRANCH_MANAGER:
      return '/cashier';
    case ROLES.DRIVER:
      return '/driver';
    case ROLES.ADMIN:
    case ROLES.SUPER_ADMIN:
      return '/admin';
    default:
      return '/';
  }
}
EOF

# ============================================
# src/lib/errors.js
# ============================================
cat > src/lib/errors.js << 'EOF'
export function handleSupabaseError(error, context = '') {
  if (!error) return null;

  const errorMap = {
    '23505': 'هذا العنصر موجود مسبقاً',
    '23503': 'المرجع غير موجود',
    '23514': 'البيانات لا تحقق الشروط',
    '42P01': 'الجدول غير موجود',
    '42501': 'لا تملك صلاحية لهذا الإجراء',
    'PGRST116': 'لم يتم العثور على نتائج',
  };

  const code = error.code || '';
  const message = errorMap[code] || error.message || 'حدث خطأ غير متوقع';

  console.error(`[Supabase${context ? ' ' + context : ''}]:`, { code, message });

  return { code, message, original: error };
}

export function isNetworkError(error) {
  if (!error) return false;
  return (
    error.message?.includes('fetch') ||
    error.message?.includes('network') ||
    error.message?.includes('Failed') ||
    (typeof navigator !== 'undefined' && navigator.onLine === false)
  );
}
EOF

# ============================================
# src/App.jsx
# ============================================
cat > src/App.jsx << 'EOF'
import React from 'react';
import AppRouter from './app/router/AppRouter';

export default function App() {
  return <AppRouter />;
}
EOF

# ============================================
# package.json (with react-router-dom)
# ============================================
cat > package.json << 'EOF'
{
  "name": "dolma-factory",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
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

echo "✅ Sprint 1-A: 5 ملفات أساسية"
