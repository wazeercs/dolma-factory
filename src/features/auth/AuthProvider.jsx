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
