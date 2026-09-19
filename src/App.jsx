import React, { useState } from 'react';
import CustomerApp from './components/CustomerApp';
import BranchApp from './components/BranchApp';
import AdminApp from './components/AdminApp';

export default function App() {
  const [view, setView] = useState('customer');
  return (
    <div dir="rtl" className="min-h-screen">
      <div className="bg-gray-900 text-white p-2 flex justify-center gap-2 text-xs sticky top-0 z-40 flex-wrap">
        {[['customer','🛒 واجهة الزبون'],['branch','🖥️ شاشة الكاشير'],['admin','📊 لوحة الإدارة']].map(([k,l]) => (
          <button key={k} onClick={() => setView(k)} className={`px-3 py-2 rounded-lg font-bold ${view === k ? 'bg-teal-600' : 'bg-gray-700'}`}>{l}</button>
        ))}
      </div>
      <div className="pt-2">
        {view === 'customer' && <CustomerApp />}
        {view === 'branch' && <BranchApp />}
        {view === 'admin' && <AdminApp />}
      </div>
    </div>
  );
}
