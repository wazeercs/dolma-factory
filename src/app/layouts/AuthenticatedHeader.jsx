import React from 'react';
import { useAuth } from '../../features/auth/AuthProvider';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../components/Toast';
import { ROLE_LABELS } from '../../lib/constants';
import { isAdmin } from '../../lib/permissions';

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

      <div className="flex items-center gap-2 flex-wrap">
        {isAdmin(role) && (
          <a
            href="/proposal.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-lg bg-teal-700 text-xs font-bold"
          >
            📄 الوثيقة
          </a>
        )}
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
