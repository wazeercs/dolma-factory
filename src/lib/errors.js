export function handleSupabaseError(error, context = '') {
  if (!error) return null;

  const errorMap = {
    '23505': 'هذا العنصر موجود مسبقاً',
    '23503': 'المرجع غير موجود',
    '23514': 'البيانات لا تحقق الشروط',
    '42P01': 'الجدول غير موجود',
    '42501': 'لا تملك صلاحية لهذا الإجراء',
    'PGRST116': 'لم يتم العثور على نتائج',
  };

  const code = error.code || '';
  const message = errorMap[code] || error.message || 'حدث خطأ غير متوقع';

  console.error(`[Supabase${context ? ' ' + context : ''}]:`, { code, message });

  return { code, message, original: error };
}

export function isNetworkError(error) {
  if (!error) return false;
  return (
    error.message?.includes('fetch') ||
    error.message?.includes('network') ||
    error.message?.includes('Failed') ||
    (typeof navigator !== 'undefined' && navigator.onLine === false)
  );
}
