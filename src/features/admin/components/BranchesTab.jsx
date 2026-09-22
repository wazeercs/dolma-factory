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
