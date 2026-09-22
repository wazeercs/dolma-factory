import React from 'react';
import ProductCard from './ProductCard';

export default function MenuGrid({ products, onSelect, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-44 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 dark:text-gray-500">
        <p className="text-4xl mb-2">😔</p>
        <p>لا توجد منتجات متوفرة حالياً</p>
      </div>
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
