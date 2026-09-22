import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { getHomeRouteForRole } from '../../lib/permissions';
import { useToast } from '../../components/Toast';

export default function Login() {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, role } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (isAuthenticated && role) {
      const dest = location.state?.from || getHomeRouteForRole(role);
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, role, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!email.trim() || !password) {
      setLocalError('يرجى إدخال البريد وكلمة المرور');
      return;
    }
    setSubmitting(true);
    const result = await login(email.trim(), password);
    setSubmitting(false);
    if (!result.success) {
      setLocalError(result.error);
      toast.error(result.error);
      return;
    }
    toast.success('تم تسجيل الدخول 🎉');
    const dest = location.state?.from || getHomeRouteForRole(result.profile?.role);
    navigate(dest, { replace: true });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-3 bg-teal-700 rounded-full flex items-center justify-center text-white text-4xl">🌿</div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-white">دولمه فاكتوري</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">تسجيل الدخول للنظام</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-bold text-gray-700 dark:text-gray-200 text-sm block mb-2">البريد الإلكتروني</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="user@dolma.com" dir="ltr" autoComplete="email"
              className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-teal-600 outline-none" />
          </div>
          <div>
            <label className="font-bold text-gray-700 dark:text-gray-200 text-sm block mb-2">كلمة المرور</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" dir="ltr" autoComplete="current-password"
              className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-teal-600 outline-none" />
          </div>

          {localError && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm font-bold p-3 rounded-xl">
              ⚠️ {localError}
            </div>
          )}

          <button type="submit" disabled={submitting}
            className="w-full bg-teal-700 text-white py-4 rounded-xl font-black text-lg shadow-lg disabled:opacity-50 active:scale-95 transition-transform">
            {submitting ? '⏳ جاري الدخول...' : 'دخول'}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-gray-400 dark:text-gray-500">
          <a href="/" className="font-bold hover:text-teal-600">← العودة للمتجر</a>
        </div>
      </div>
    </div>
  );
}
