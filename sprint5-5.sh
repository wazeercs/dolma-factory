#!/data/data/com.termux/files/usr/bin/bash
set -e

mkdir -p src/app/layouts

# ═══════════════════════════════════════════
# AuthenticatedHeader.jsx
# ═══════════════════════════════════════════
cat > src/app/layouts/AuthenticatedHeader.jsx << 'EOF'
import React from 'react';
import { useAuth } from '../../features/auth/AuthProvider';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../components/Toast';
import { ROLE_LABELS } from '../../lib/constants';

export default function AuthenticatedHeader({ title, icon }) {
  const { profile, role, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const toast = useToast();

  const handleLogout = async () => {
    await logout();
    toast.success('تم تسجيل الخروج');
    window.location.href = '/login';
  };

  return (
    <div className="bg-gray-900 dark:bg-black text-white px-3 py-2 flex justify-between items-center sticky top-0 z-40 flex-wrap gap-2">
      <div className="flex items-center gap-2 text-sm font-bold">
        {icon && <span>{icon}</span>}
        <span>{title}</span>
        {profile?.full_name && (
          <span className="text-xs text-gray-400 hidden sm:inline">
            ({profile.full_name})
          </span>
        )}
        {role && (
          <span className="text-xs bg-teal-600 px-2 py-0.5 rounded-full">
            {ROLE_LABELS[role] || role}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="px-3 py-1 rounded-lg bg-gray-700 dark:bg-gray-800 text-xs font-bold"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        <a
          href="/"
          className="px-3 py-1 rounded-lg bg-gray-700 dark:bg-gray-800 text-xs font-bold"
        >
          🏠 المتجر
        </a>
        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded-lg bg-red-600 text-xs font-bold"
        >
          خروج
        </button>
      </div>
    </div>
  );
}
EOF

# ═══════════════════════════════════════════
# تحديث AppRouter لعرض Header
# ═══════════════════════════════════════════
cat > src/app/router/AppRouter.jsx << 'EOF'
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../../features/auth/AuthProvider';
import ProtectedRoute from '../../features/auth/ProtectedRoute';
import Login from '../../features/auth/Login';
import AuthenticatedHeader from '../layouts/AuthenticatedHeader';
import CustomerApp from '../../components/CustomerApp';
import BranchApp from '../../components/BranchApp';
import AdminApp from '../../components/AdminApp';
import DriverApp from '../../components/DriverApp';

function NotFound() {
  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <p className="text-6xl mb-3">🔍</p>
        <h1 className="text-2xl font-black text-gray-800 dark:text-white mb-2">الصفحة غير موجودة</h1>
        <a href="/" className="text-teal-600 dark:text-teal-400 font-bold">← العودة للرئيسية</a>
      </div>
    </div>
  );
}

function CashierLayout() {
  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthenticatedHeader title="شاشة الكاشير" icon="🖥️" />
      <BranchApp />
    </div>
  );
}

function AdminLayout() {
  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthenticatedHeader title="لوحة الإدارة" icon="📊" />
      <AdminApp />
    </div>
  );
}

function DriverLayout() {
  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthenticatedHeader title="شاشة المناديب" icon="🛵" />
      <DriverApp />
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<CustomerApp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cashier" element={<ProtectedRoute path="/cashier"><CashierLayout /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute path="/admin"><AdminLayout /></ProtectedRoute>} />
          <Route path="/driver" element={<ProtectedRoute path="/driver"><DriverLayout /></ProtectedRoute>} />
          <Route path="/cashier/*" element={<Navigate to="/cashier" replace />} />
          <Route path="/driver/*" element={<Navigate to="/driver" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
EOF

echo ""
echo "✅ Sprint 5.5: Authenticated Header with Logout"
ls -la src/app/layouts/
ls -la src/app/router/AppRouter.jsx
