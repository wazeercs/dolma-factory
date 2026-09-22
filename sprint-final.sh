#!/data/data/com.termux/files/usr/bin/bash
set -e

mkdir -p src/features/admin/components
mkdir -p src/features/driver/components

# ═══════════════════════════════════════════
# ADMIN APP — Components
# ═══════════════════════════════════════════

# ---------- StatsCards.jsx ----------
cat > src/features/admin/components/StatsCards.jsx << 'EOF'
import React from 'react';

export default function StatsCards({ stats }) {
  const cards = [
    { label: 'إجمالي المبيعات', value: `${stats.revenue} SR`, color: 'border-teal-500' },
    { label: 'طلبات اليوم', value: stats.todayOrders, color: 'border-blue-500' },
    { label: 'إجمالي الطلبات', value: stats.allOrders, color: 'border-yellow-500' },
    { label: 'متوسط الطلب', value: `${stats.avg} SR`, color: 'border-green-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border-r-4 ${c.color}`}
        >
          <h3 className="text-gray-500 dark:text-gray-400 font-bold text-xs mb-2">{c.label}</h3>
          <p className="text-2xl font-black text-gray-800 dark:text-white">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
EOF

# ---------- ProductsTab.jsx ----------
cat > src/features/admin/components/ProductsTab.jsx << 'EOF'
import React from 'react';

export default function ProductsTab({ products, onToggleStock, onUpdatePrice }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-black mb-4 text-gray-800 dark:text-white">
        إدارة المنتجات والأسعار
      </h2>

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="border dark:border-gray-700 rounded-xl p-3">
            <div className="flex items-center gap-3 mb-3">
              <img src={p.image_url} className="w-14 h-14 rounded-lg object-cover" alt="" />
              <div className="flex-1">
                <h4 className="font-bold text-sm text-gray-800 dark:text-white">{p.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{p.category}</p>
              </div>
              <button
                onClick={() => onToggleStock(p.id, p.in_stock)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  p.in_stock
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                }`}
              >
                {p.in_stock ? '✓ متوفر' : '✗ نافذ'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(p.variants || []).map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-2 py-1"
                >
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{v.name}:</span>
                  <input
                    type="number"
                    defaultValue={v.price}
                    onBlur={(e) => onUpdatePrice(v.id, e.target.value)}
                    className="w-16 text-xs font-bold text-teal-700 dark:text-teal-400 bg-transparent border-b border-teal-300 dark:border-teal-600 outline-none text-center"
                  />
                  <span className="text-xs text-gray-700 dark:text-gray-200">SR</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
EOF

# ---------- OrdersTab.jsx ----------
cat > src/features/admin/components/OrdersTab.jsx << 'EOF'
import React from 'react';
import { ORDER_STATUS_LABELS } from '../../../lib/constants';

export default function OrdersTab({ orders }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-black mb-4 text-gray-800 dark:text-white">
        سجل الطلبات ({orders.length})
      </h2>

      <div className="space-y-2">
        {orders.map((o) => (
          <div
            key={o.id}
            className="flex items-center gap-3 p-3 border dark:border-gray-700 rounded-xl"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-gray-800 dark:text-white">
                  #{o.order_number}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{o.customer_name}</span>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                  {ORDER_STATUS_LABELS[o.status] || o.status}
                </span>
                {o.coupon_code && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 px-2 py-0.5 rounded">
                    🎁 {o.coupon_code}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {o.order_type === 'delivery' ? 'توصيل' : 'استلام'}
              </p>
            </div>
            <div className="text-left">
              <b className="text-teal-700 dark:text-teal-400 text-sm">{o.total} SR</b>
              {o.discount > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400">-{o.discount}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
EOF

# ---------- BranchesTab.jsx ----------
cat > src/features/admin/components/BranchesTab.jsx << 'EOF'
import React from 'react';

export default function BranchesTab({ branches }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {branches.map((b) => (
        <div
          key={b.id}
          className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border-r-4 border-green-500"
        >
          <h3 className="font-black text-lg text-gray-800 dark:text-white">{b.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{b.address}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">📏 نطاق: {b.delivery_radius_km} كم</p>
          <p className="text-sm text-gray-500 dark:text-gray-400" dir="ltr">📞 {b.phone}</p>
        </div>
      ))}
    </div>
  );
}
EOF

# ---------- DriversTab.jsx ----------
cat > src/features/admin/components/DriversTab.jsx << 'EOF'
import React from 'react';

export default function DriversTab({ drivers }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-black mb-4 text-gray-800 dark:text-white">إدارة المناديب</h2>

      {drivers.map((d) => (
        <div
          key={d.id}
          className="flex items-center gap-3 p-3 border dark:border-gray-700 rounded-xl mb-2"
        >
          <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">
            🛵
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-gray-800 dark:text-white">{d.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400" dir="ltr">{d.phone}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              🚚 {d.total_deliveries} توصيلة
            </p>
          </div>
          <span
            className={`px-2 py-1 rounded text-xs font-bold ${
              d.is_available
                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
            }`}
          >
            {d.is_available ? 'متاح' : 'مشغول'}
          </span>
        </div>
      ))}
    </div>
  );
}
EOF

# ---------- AdminApp.jsx (الرئيسي) ----------
cat > src/features/admin/AdminApp.jsx << 'EOF'
import React, { useState, useMemo } from 'react';
import { useProducts, useOrders, useBranches, useDrivers } from '../../hooks/useSupabaseData';
import { toggleProductStock, updateVariantPrice } from '../../hooks/useOrdersApi';
import { useToast } from '../../components/Toast';
import StatsCards from './components/StatsCards';
import ProductsTab from './components/ProductsTab';
import OrdersTab from './components/OrdersTab';
import BranchesTab from './components/BranchesTab';
import DriversTab from './components/DriversTab';

export default function AdminApp() {
  const toast = useToast();
  const [tab, setTab] = useState('dash');
  const branches = useBranches();
  const { products, refetch: refetchProducts } = useProducts();
  const { orders } = useOrders();
  const { drivers } = useDrivers();

  const handleToggleStock = async (id, current) => {
    try {
      await toggleProductStock(id, !current);
      await refetchProducts();
      toast.success(!current ? 'تم تفعيل المنتج' : 'تم إيقاف المنتج');
    } catch {
      toast.error('فشل تحديث حالة المنتج');
    }
  };

  const handleUpdatePrice = async (variantId, newPrice) => {
    try {
      await updateVariantPrice(variantId, parseFloat(newPrice));
      await refetchProducts();
      toast.success('تم تحديث السعر');
    } catch {
      toast.error('فشل تحديث السعر');
    }
  };

  const stats = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(
      (o) => new Date(o.created_at).getTime() >= today
    );
    const delivered = orders.filter((o) => o.status === 'delivered');
    const revenue = delivered.reduce((s, o) => s + Number(o.total), 0);
    const avg =
      orders.length > 0
        ? Math.round(orders.reduce((s, o) => s + Number(o.total), 0) / orders.length)
        : 0;
    return {
      todayOrders: todayOrders.length,
      allOrders: orders.length,
      revenue,
      avg,
    };
  }, [orders]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm w-fit overflow-x-auto max-w-full">
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
              tab === k
                ? 'bg-teal-700 text-white'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'dash' && <StatsCards stats={stats} />}
      {tab === 'products' && (
        <ProductsTab
          products={products}
          onToggleStock={handleToggleStock}
          onUpdatePrice={handleUpdatePrice}
        />
      )}
      {tab === 'orders' && <OrdersTab orders={orders} />}
      {tab === 'branches' && <BranchesTab branches={branches} />}
      {tab === 'drivers' && <DriversTab drivers={drivers} />}
    </div>
  );
}
EOF

# ═══════════════════════════════════════════
# DRIVER APP — Components
# ═══════════════════════════════════════════

# ---------- DriverSelect.jsx ----------
cat > src/features/driver/components/DriverSelect.jsx << 'EOF'
import React from 'react';

export default function DriverSelect({ drivers, onSelect }) {
  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center text-4xl">
          🛵
        </div>
        <h1 className="text-2xl font-black text-gray-800 dark:text-white mb-2">من أنت؟</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">اختر اسمك للبدء</p>
      </div>

      <div className="space-y-3">
        {drivers.map((d) => (
          <button
            key={d.id}
            onClick={() => onSelect(d)}
            className="w-full p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-400 transition-all text-right flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold text-lg">
              {d.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 dark:text-white">{d.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400" dir="ltr">{d.phone}</p>
            </div>
            <span className="text-gray-400">←</span>
          </button>
        ))}
      </div>
    </div>
  );
}
EOF

# ---------- DriverOrderCard.jsx ----------
cat > src/features/driver/components/DriverOrderCard.jsx << 'EOF'
import React from 'react';

export default function DriverOrderCard({ order, onStartDelivery, onDeliver }) {
  const lng = order.delivery_location?.coordinates?.[0] || 46.6753;
  const lat = order.delivery_location?.coordinates?.[1] || 24.7136;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border-r-4 border-blue-500">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
            #{order.order_number}
          </span>
          <h4 className="font-bold text-gray-800 dark:text-white mt-2">{order.customer_name}</h4>
          <a
            href={`tel:${order.customer_phone}`}
            className="text-xs text-teal-600 dark:text-teal-400 font-bold"
            dir="ltr"
          >
            📞 {order.customer_phone}
          </a>
        </div>
        <div className="text-left">
          <p className="text-xs text-gray-400">
            {new Date(order.created_at).toLocaleTimeString('ar-SA', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className="font-black text-teal-700 dark:text-teal-400 text-lg">{order.total} SR</p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl mb-3 text-sm font-bold text-gray-700 dark:text-gray-200">
        {(order.order_items || []).map((item, i) => (
          <div key={i} className="py-0.5">
            {item.product_name}
            {item.flavor_name && ` (${item.flavor_name})`} - {item.variant_name} × {item.quantity}
          </div>
        ))}
      </div>

      {order.order_type === 'delivery' && order.delivery_address && (
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl mb-3 text-xs text-blue-800 dark:text-blue-200 flex gap-2">
          <span>📍</span>
          <span>{order.delivery_address}</span>
        </div>
      )}

      <div className="flex gap-2">
        {order.status === 'assigned' && (
          <button
            onClick={() => onStartDelivery(order.id)}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm"
          >
            🛵 بدء التوصيل
          </button>
        )}

        {order.status === 'out_for_delivery' && (
          <>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-bold text-sm text-center"
            >
              🗺️ الخريطة
            </a>
            <button
              onClick={() => onDeliver(order.id)}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold text-sm"
            >
              ✅ تم التسليم
            </button>
          </>
        )}
      </div>
    </div>
  );
}
EOF

# ---------- DriverApp.jsx (الرئيسي) ----------
cat > src/features/driver/DriverApp.jsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { useDrivers, useOrders } from '../../hooks/useSupabaseData';
import { updateOrderStatus, toggleDriverAvailability } from '../../hooks/useOrdersApi';
import { useToast } from '../../components/Toast';
import { useAuth } from '../auth/AuthProvider';
import DriverSelect from './components/DriverSelect';
import DriverOrderCard from './components/DriverOrderCard';

export default function DriverApp() {
  const toast = useToast();
  const { profile } = useAuth();
  const [currentDriver, setCurrentDriver] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dolma_driver') || 'null');
    } catch {
      return null;
    }
  });

  const { drivers } = useDrivers();
  const { orders } = useOrders();

  useEffect(() => {
    if (currentDriver) {
      localStorage.setItem('dolma_driver', JSON.stringify(currentDriver));
      const fresh = drivers.find((d) => d.id === currentDriver.id);
      if (fresh && fresh.is_available !== currentDriver.is_available) {
        setCurrentDriver(fresh);
      }
    }
  }, [currentDriver, drivers]);

  const logout = () => {
    setCurrentDriver(null);
    localStorage.removeItem('dolma_driver');
    toast.info('تم تسجيل الخروج');
  };

  const handleToggleAvailability = async () => {
    try {
      const newState = !currentDriver.is_available;
      await toggleDriverAvailability(currentDriver.id, newState);
      setCurrentDriver({ ...currentDriver, is_available: newState });
      toast.success(newState ? 'أنت الآن متاح ✅' : 'أنت الآن مشغول ⏸');
    } catch {
      toast.error('فشل تحديث الحالة');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(newStatus === 'delivered' ? 'تم التسليم بنجاح 🎉' : 'تم تحديث الطلب');
    } catch {
      toast.error('فشل تحديث الطلب');
    }
  };

  if (!currentDriver) {
    return <DriverSelect drivers={drivers} onSelect={setCurrentDriver} />;
  }

  const myOrders = orders.filter(
    (o) =>
      o.driver_id === currentDriver.id &&
      o.status !== 'delivered' &&
      o.status !== 'cancelled' &&
      o.status !== 'rejected'
  );

  const completedToday = orders.filter(
    (o) =>
      o.driver_id === currentDriver.id &&
      o.status === 'delivered' &&
      new Date(o.created_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-4 flex items-center gap-3 flex-wrap">
        <div className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-black text-xl">
          {currentDriver.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-black text-gray-800 dark:text-white truncate">
            {currentDriver.name}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            🚚 {completedToday} توصيلة اليوم
          </p>
        </div>
        <button
          onClick={handleToggleAvailability}
          className={`px-4 py-2 rounded-xl font-bold text-sm ${
            currentDriver.is_available
              ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
          }`}
        >
          {currentDriver.is_available ? '✓ متاح' : '⏸ مشغول'}
        </button>
        <button
          onClick={logout}
          className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm"
        >
          خروج
        </button>
      </div>

      <h3 className="font-black text-gray-800 dark:text-white mb-3 px-1">
        طلباتي الحالية ({myOrders.length})
      </h3>

      {myOrders.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <p className="text-5xl mb-2">🎉</p>
          <p>لا توجد طلبات مسندة إليك حالياً</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myOrders.map((o) => (
            <DriverOrderCard
              key={o.id}
              order={o}
              onStartDelivery={(id) => handleStatusChange(id, 'out_for_delivery')}
              onDeliver={(id) => handleStatusChange(id, 'delivered')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
EOF

# ═══════════════════════════════════════════
# RE-EXPORT SHIMS في المكان القديم
# ═══════════════════════════════════════════

cat > src/components/AdminApp.jsx << 'EOF'
export { default } from '../features/admin/AdminApp';
EOF

cat > src/components/DriverApp.jsx << 'EOF'
export { default } from '../features/driver/DriverApp';
EOF

# ═══════════════════════════════════════════
# تحقق نهائي
# ═══════════════════════════════════════════

echo ""
echo "🎉 Sprint 5+6 Complete!"
echo ""
echo "══════ Admin ══════"
ls -la src/features/admin/ 2>/dev/null
echo ""
ls -la src/features/admin/components/ 2>/dev/null
echo ""
echo "══════ Driver ══════"
ls -la src/features/driver/ 2>/dev/null
echo ""
ls -la src/features/driver/components/ 2>/dev/null
echo ""
echo "══════ Shims ══════"
ls -la src/components/AdminApp.jsx src/components/DriverApp.jsx
