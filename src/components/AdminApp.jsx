import React, { useState, useMemo } from 'react';
import { useProducts, useOrders, useBranches, useDrivers } from '../hooks/useSupabaseData';
import { supabase } from '../lib/supabaseClient';

export default function AdminApp() {
  const [tab, setTab] = useState('dash');
  const branches = useBranches();
  const { products, refetch: refetchProducts } = useProducts();
  const { orders } = useOrders();
  const drivers = useDrivers();

  const toggleStock = async (id, current) => {
    await supabase.from('products').update({ in_stock: !current }).eq('id', id);
    refetchProducts();
  };

  const updatePrice = async (variantId, newPrice) => {
    await supabase
      .from('product_variants')
      .update({ price: parseFloat(newPrice) })
      .eq('id', variantId);
    refetchProducts();
  };

  const stats = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const todayOrders = orders.filter((o) => new Date(o.created_at).getTime() >= today);
    const delivered = orders.filter((o) => o.status === 'delivered');
    const revenue = delivered.reduce((s, o) => s + Number(o.total), 0);
    const avg =
      orders.length > 0
        ? Math.round(orders.reduce((s, o) => s + Number(o.total), 0) / orders.length)
        : 0;
    return { todayOrders: todayOrders.length, allOrders: orders.length, revenue, avg };
  }, [orders]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex gap-2 mb-6 bg-white p-2 rounded-2xl shadow-sm w-fit overflow-x-auto max-w-full">
        {[
          ['dash', '📊 الإحصائيات'],
          ['products', '🍽️ المنتجات'],
          ['orders', '📦 الطلبات'],
          ['branches', '🏬 الفروع'],
          ['drivers', '🛵 المناديب'],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap ${
              tab === k ? 'bg-teal-700 text-white' : 'text-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'dash' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-teal-500">
            <h3 className="text-gray-500 font-bold text-xs mb-2">إجمالي المبيعات</h3>
            <p className="text-2xl font-black text-gray-800">{stats.revenue} SR</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-blue-500">
            <h3 className="text-gray-500 font-bold text-xs mb-2">طلبات اليوم</h3>
            <p className="text-2xl font-black text-gray-800">{stats.todayOrders}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-yellow-500">
            <h3 className="text-gray-500 font-bold text-xs mb-2">إجمالي الطلبات</h3>
            <p className="text-2xl font-black text-gray-800">{stats.allOrders}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-green-500">
            <h3 className="text-gray-500 font-bold text-xs mb-2">متوسط الطلب</h3>
            <p className="text-2xl font-black text-gray-800">{stats.avg} SR</p>
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-lg font-black mb-4">إدارة المنتجات والأسعار</h2>
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="border rounded-xl p-3">
                <div className="flex items-center gap-3 mb-3">
                  <img src={p.image_url} className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{p.name}</h4>
                    <p className="text-xs text-gray-500">{p.category}</p>
                  </div>
                  <button
                    onClick={() => toggleStock(p.id, p.in_stock)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {p.in_stock ? '✓ متوفر' : '✗ نافذ'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(p.variants || []).map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1"
                    >
                      <span className="text-xs font-bold">{v.name}:</span>
                      <input
                        type="number"
                        defaultValue={v.price}
                        onBlur={(e) => updatePrice(v.id, e.target.value)}
                        className="w-16 text-xs font-bold text-teal-700 bg-transparent border-b border-teal-300 outline-none text-center"
                      />
                      <span className="text-xs">SR</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-lg font-black mb-4">سجل الطلبات ({orders.length})</h2>
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center gap-3 p-3 border rounded-xl">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">#{o.order_number}</span>
                    <span className="text-xs text-gray-500">{o.customer_name}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {o.order_type === 'delivery' ? 'توصيل' : 'استلام'} • {o.status}
                  </p>
                </div>
                <b className="text-teal-700 text-sm">{o.total} SR</b>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'branches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {branches.map((b) => (
            <div key={b.id} className="bg-white p-5 rounded-2xl shadow-sm border-r-4 border-green-500">
              <h3 className="font-black text-lg">{b.name}</h3>
              <p className="text-sm text-gray-500 mt-2">{b.address}</p>
              <p className="text-sm text-gray-500">📏 نطاق: {b.delivery_radius_km} كم</p>
              <p className="text-sm text-gray-500" dir="ltr">📞 {b.phone}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'drivers' && (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-lg font-black mb-4">إدارة المناديب</h2>
          {drivers.map((d) => (
            <div key={d.id} className="flex items-center gap-3 p-3 border rounded-xl mb-2">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                🛵
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{d.name}</h4>
                <p className="text-xs text-gray-500" dir="ltr">{d.phone}</p>
                <p className="text-xs text-gray-400">🚚 {d.total_deliveries} توصيلة</p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-bold ${
                  d.is_available ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {d.is_available ? 'متاح' : 'مشغول'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
          }
