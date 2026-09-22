import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../../features/auth/AuthProvider';
import ProtectedRoute from '../../features/auth/ProtectedRoute';
import Login from '../../features/auth/Login';
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

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<CustomerApp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cashier" element={<ProtectedRoute path="/cashier"><BranchApp /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute path="/admin"><AdminApp /></ProtectedRoute>} />
          <Route path="/driver" element={<ProtectedRoute path="/driver"><DriverApp /></ProtectedRoute>} />
          <Route path="/cashier/*" element={<Navigate to="/cashier" replace />} />
          <Route path="/driver/*" element={<Navigate to="/driver" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
