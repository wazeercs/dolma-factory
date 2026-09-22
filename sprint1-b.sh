#!/data/data/com.termux/files/usr/bin/bash
set -e

# ============================================
# src/features/auth/AuthProvider.jsx
# ============================================
cat > src/features/auth/AuthProvider.jsx << 'EOF'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { ROLES } from '../../lib/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) { setProfile(null); return null; }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone, role, branch_id, is_active')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Profile fetch error:', error);
      setError(error.message);
      return null;
    }

    if (!data) {
      const { data: created } = await supabase
        .from('profiles')
        .insert({ id: userId, full_name: '', role: ROLES.CUSTOMER })
        .select().maybeSingle();
      setProfile(created);
      return created;
    }

    setProfile(data);
    return data;
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => mounted && setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      if (event === 'SIGNED_IN' && newSession?.user) {
        await fetchProfile(newSession.user.id);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  const login = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const map = {
          'Invalid login credentials': 'البريد أو كلمة المرور غير صحيحة',
          'Email not confirmed': 'البريد غير مؤكد',
          'Too many requests': 'محاولات كثيرة. حاول لاحقاً',
        };
        const msg = map[error.message] || error.message;
        setError(msg);
        return { success: false, error: msg };
      }
      if (data.user) {
        const prof = await fetchProfile(data.user.id);
        return { success: true, profile: prof };
      }
      return { success: false, error: 'فشل تسجيل الدخول' };
    } catch (err) {
      const msg = err.message || 'حدث خطأ';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user || null,
      profile,
      role: profile?.role || null,
      branchId: profile?.branch_id || null,
      isAuthenticated: !!session,
      loading,
      error,
      login,
      logout,
      refetchProfile: () => session?.user && fetchProfile(session.user.id),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
EOF

# ============================================
# src/features/auth/ProtectedRoute.jsx
# ============================================
cat > src/features/auth/ProtectedRoute.jsx << 'EOF'
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { canAccessRoute, getHomeRouteForRole } from '../../lib/permissions';

export default function ProtectedRoute({ path, children }) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 dark:text-gray-400 font-bold">جاري التحقق...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!canAccessRoute(role, path)) {
    return <Navigate to={getHomeRouteForRole(role)} replace />;
  }

  return children;
}
EOF

# ============================================
# src/features/auth/Login.jsx
# ============================================
cat > src/features/auth/Login.jsx << 'EOF'
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
EOF

# ============================================
# src/app/router/AppRouter.jsx
# ============================================
cat > src/app/router/AppRouter.jsx << 'EOF'
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
EOF

echo "✅ Sprint 1-B: Auth + Router"
