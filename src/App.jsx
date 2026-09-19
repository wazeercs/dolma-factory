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
