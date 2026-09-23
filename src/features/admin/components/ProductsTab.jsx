import React, { useState } from 'react';
import { deleteProduct } from '../../../services/supabase/admin-crud';
import { useToast } from '../../../components/Toast';
import ProductFormModal from './ProductFormModal';

export default function ProductsTab({ products, onToggleStock, onUpdatePrice, onRefetch }) {
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const handleDelete = async (product) => {
    if (!window.confirm(`حذف "${product.name}"؟ سيتم حذف جميع الأحجام والنكهات.`)) return;
    try {
      await deleteProduct(product.id);
      toast.success('تم الحذف');
      onRefetch?.();
    } catch (e) {
      toast.error(e.message || 'فشل الحذف');
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditProduct(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-black text-gray-800 dark:text-white">
          إدارة المنتجات ({products.length})
        </h2>
        <button
          onClick={() => { setEditProduct(null); setShowForm(true); }}
          className="bg-teal-700 text-white px-4 py-2 rounded-xl font-bold text-sm"
        >
          ➕ إضافة منتج
        </button>
      </div>

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="border dark:border-gray-700 rounded-xl p-3">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <img src={p.image_url} className="w-14 h-14 rounded-lg object-cover" alt="" />
              <div className="flex-1 min-w-[120px]">
                <h4 className="font-bold text-sm text-gray-800 dark:text-white">{p.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{p.category}</p>
                <p className="text-xs text-gray-400">
                  {(p.variants || []).length} حجم • {(p.flavors || []).length} نكهة
                </p>
              </div>
              <div className="flex gap-1 flex-wrap">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  ✏️ تعديل
                </button>
                <button
                  onClick={() => onToggleStock(p.id, p.in_stock)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    p.in_stock
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  }`}
                >
                  {p.in_stock ? '✓ متوفر' : '✗ نافذ'}
                </button>
                <button
                  onClick={() => handleDelete(p)}
                  className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(p.variants || []).map((v) => (
                <div key={v.id} className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-2 py-1">
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

            {(p.flavors || []).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {p.flavors.map((f) => (
                  <span key={f.id} className="text-xs bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-1 rounded">
                    {f.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <ProductFormModal
          product={editProduct}
          onClose={handleClose}
          onSaved={() => onRefetch?.()}
        />
      )}
    </div>
  );
}
