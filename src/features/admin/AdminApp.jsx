import React, { useState, useMemo } from 'react';
import { useProducts, useOrders, useBranches } from '../../hooks/useSupabaseData';
import { toggleProductStock, updateVariantPrice } from '../../hooks/useOrdersApi';
import { useToast } from '../../components/Toast';
import StatsCards from './components/StatsCards';
import ProductsTab from './components/ProductsTab';
import OrdersTab from './components/OrdersTab';
import BranchesTab from './components/BranchesTab';
import DriversTab from './components/DriversTab';
import HoursTab from './components/HoursTab';
import ZonesTab from './components/ZonesTab';
import UsersTab from './components/UsersTab';
import ReportsTab from './components/ReportsTab';
import LoyaltyTab from './components/LoyaltyTab';

export default function AdminApp() {
  const toast = useToast();
  const [tab, setTab] = useState('dash');
  const branches = useBranches();
  const { products, refetch: refetchProducts } = useProducts();
  const { orders } = useOrders();

  const handleToggleStock = async (id, current) => {
    try {
      await toggleProductStock(id, !current);
      await refetchProducts();
      toast.success(!current ? 'تم تفعيل المنتج' : 'تم إيقاف المنتج');
    } catch { toast.error('فشل'); }
  };

  const handleUpdatePrice = async (variantId, newPrice) => {
    try {
      await updateVariantPrice(variantId, parseFloat(newPrice));
      await refetchProducts();
      toast.success('تم التحديث');
    } catch { toast.error('فشل'); }
  };

  const stats = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const todayOrders = orders.filter((o) => new Date(o.created_at).getTime() >= today);
    const delivered = orders.filter((o) => o.status === 'delivered');
    const revenue = delivered.reduce((s, o) => s + Number(o.total), 0);
    const avg = orders.length > 0 ? Math.round(orders.reduce((s, o) => s + Number(o.total), 0) / orders.length) : 0;
    return { todayOrders: todayOrders.length, allOrders: orders.length, revenue, avg };
  }, [orders]);

  const tabs = [
    ['dash', '📊 الإحصائيات'],
    ['reports', '📈 التقارير'],
    ['products', '🍽️ المنتجات'],
    ['orders', '📦 الطلبات'],
    ['branches', '🏬 الفروع'],
    ['drivers', '🛵 المناديب'],
    ['hours', '🕐 الساعات'],
    ['zones', '📍 التوصيل'],
    ['users', '👥 المستخدمون'],
    ['loyalty', '🎁 الولاء'],
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex gap-2 mb-6 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm w-fit overflow-x-auto max-w-full">
        {tabs.map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap ${
              tab === k ? 'bg-teal-700 text-white' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'dash' && <StatsCards stats={stats} />}
      {tab === 'reports' && <ReportsTab />}
      {tab === 'products' && (
        <ProductsTab
          products={products}
          onToggleStock={handleToggleStock}
          onUpdatePrice={handleUpdatePrice}
          onRefetch={refetchProducts}
        />
      )}
      {tab === 'orders' && <OrdersTab orders={orders} />}
      {tab === 'branches' && <BranchesTab branches={branches} />}
      {tab === 'drivers' && <DriversTab />}
      {tab === 'hours' && <HoursTab />}
      {tab === 'zones' && <ZonesTab />}
      {tab === 'users' && <UsersTab />}
      {tab === 'loyalty' && <LoyaltyTab />}
    </div>
  );
}
