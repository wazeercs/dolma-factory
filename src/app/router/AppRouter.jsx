import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../../features/auth/AuthProvider';
import ProtectedRoute from '../../features/auth/ProtectedRoute';
import Login from '../../features/auth/Login';
import AuthenticatedHeader from '../layouts/AuthenticatedHeader';

// ═══ Lazy Loading — تحميل الواجهات عند الحاجة فقط ═══
const CustomerApp = lazy(() => import('../../features/customer/CustomerApp'));
const BranchApp = lazy(() => import('../../features/branch/BranchApp'));
const AdminApp = lazy(() => import('../../features/admin/AdminApp'));
const DriverApp = lazy(() => import('../../features/driver/DriverApp'));

// ═══ Loading Fallback ═══
function LoadingFallback() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
    >
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-teal-700 dark:text-teal-400 font-bold">جاري التحميل...</p>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
    >
      <div className="text-center">
        <p className="text-6xl mb-3">🔍</p>
        <h1 className="text-2xl font-black text-gray-800 dark:text-white mb-2">
          الصفحة غير موجودة
        </h1>
        <a
          href="/"
          className="text-teal-600 dark:text-teal-400 font-bold"
        >
          ← العودة للرئيسية
        </a>
      </div>
    </div>
  );
}

// ═══ Layouts ═══
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
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<CustomerApp />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/cashier"
              element={
                <ProtectedRoute path="/cashier">
                  <CashierLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute path="/admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver"
              element={
                <ProtectedRoute path="/driver">
                  <DriverLayout />
                </ProtectedRoute>
              }
            />
            <Route path="/cashier/*" element={<Navigate to="/cashier" replace />} />
            <Route path="/driver/*" element={<Navigate to="/driver" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
