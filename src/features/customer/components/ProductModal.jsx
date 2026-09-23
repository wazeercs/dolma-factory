import React, { useState, useEffect } from 'react';

export default function ProductModal({ product, onClose, onAdd }) {
  const [flavor, setFlavor] = useState(null);
  const [variant, setVariant] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setFlavor(null);
    setVariant(null);
    setQty(1);
  }, [product?.id]);

  // إغلاق بـ Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [product, onClose]);

  if (!product) return null;

  const totalPrice = variant ? (variant.price + (flavor?.extra_price || 0)) * qty : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div
        className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-t-3xl max-h-[88vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-44">
          <img
            src={product.image_url}
            className="w-full h-full object-cover rounded-t-3xl"
            alt={product.name}
          />
          <button
            onClick={onClose}
            className="absolute top-4 left-4 bg-white/95 w-9 h-9 rounded-full shadow-md font-bold text-lg text-black active:scale-95"
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 no-scrollbar">
          <h2
            id="product-modal-title"
            className="text-2xl font-black text-gray-800 dark:text-white mb-4"
          >
            {product.name}
          </h2>

          {product.flavors?.length > 0 && (
            <div className="mb-5">
              <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-3">
                اختر النكهة:
              </h4>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="نكهات المنتج">
                {product.flavors.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFlavor(f)}
                    role="radio"
                    aria-checked={flavor?.id === f.id}
                    className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ${
                      flavor?.id === f.id
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-5">
            <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-3">
              اختر الحجم:
            </h4>
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="أحجام المنتج">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariant(v)}
                  role="radio"
                  aria-checked={variant?.id === v.id}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center transition-all ${
                    variant?.id === v.id
                      ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-600 text-teal-800 dark:text-teal-300'
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200'
                  }`}
                >
                  <span className="font-bold">{v.name}</span>
                  <span className="text-sm font-semibold num-ltr">{v.price} SR</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-gray-700 dark:text-gray-200">الكمية:</span>
            <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="text-2xl font-bold text-gray-600 dark:text-gray-300 w-8"
                aria-label="تقليل الكمية"
              >
                −
              </button>
              <span
                className="font-black text-lg w-6 text-center text-gray-800 dark:text-white num-ltr"
                aria-live="polite"
              >
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="text-2xl font-bold text-teal-700 dark:text-teal-400 w-8"
                aria-label="زيادة الكمية"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-3xl">
          <button
            onClick={() => onAdd(product, flavor, variant, qty)}
            className="w-full bg-teal-700 text-white py-4 rounded-xl font-black text-lg flex justify-between items-center px-6 shadow-lg active:scale-95 transition-transform"
            aria-label={`إضافة ${product.name} للسلة بـ ${totalPrice} ريال`}
          >
            <span>إضافة للسلة</span>
            <span className="num-ltr">{totalPrice} SR</span>
          </button>
        </div>
      </div>
    </div>
  );
}
