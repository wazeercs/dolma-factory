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
