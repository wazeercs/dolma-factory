import React from 'react';
import ProductCard from './ProductCard';
import EmptyState from '../../../components/EmptyState';

export default function MenuGrid({ products, onSelect, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="w-full h-28 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-2/3 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon="🍽️"
        title="لا توجد منتجات متاحة"
        description="يبدو أن جميع المنتجات غير متوفرة حالياً. يرجى المحاولة لاحقاً أو التواصل مع الفرع."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onClick={onSelect} />
      ))}
    </div>
  );
}
