import React from 'react';
import OptimizedImage from '../../../components/OptimizedImage';

export default function ProductCard({ product, onClick, priority = false }) {
  return (
    <div
      onClick={() => onClick(product)}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden cursor-pointer active:scale-95 transition-transform border border-gray-100 dark:border-gray-700 relative"
    >
      {product.is_bundle && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-md">
            👨‍👩‍👧‍👦 عائلي
          </span>
        </div>
      )}

      <OptimizedImage
        src={product.image_url}
        alt={product.name}
        aspectRatio="wide"
        priority={priority}
      />

      <div className="p-3 text-center">
        <h3 className="font-bold text-gray-800 dark:text-white text-sm line-clamp-2">
          {product.name}
        </h3>
        {product.bundle_description && (
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
            {product.bundle_description}
          </p>
        )}
        <p className="text-sm text-teal-600 dark:text-teal-400 font-bold mt-1 num-ltr">
          من {product.variants[0]?.price || 0} SR
        </p>
      </div>
    </div>
  );
}
