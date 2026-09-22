import React from 'react';

export default function ProductCard({ product, onClick }) {
  return (
    <div
      onClick={() => onClick(product)}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden cursor-pointer active:scale-95 transition-transform border border-gray-100 dark:border-gray-700"
    >
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-28 object-cover"
        loading="lazy"
      />
      <div className="p-3 text-center">
        <h3 className="font-bold text-gray-800 dark:text-white text-sm">
          {product.name}
        </h3>
        <p className="text-sm text-teal-600 dark:text-teal-400 font-bold mt-1">
          من {product.variants[0]?.price || 0} SR
        </p>
      </div>
    </div>
  );
}
