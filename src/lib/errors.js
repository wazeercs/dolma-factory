export function handleSupabaseError(error, context = '') {
  if (!error) return null;

  const code = error.code || '';
  const message = getSafeErrorMessage(error);

  console.error(`[Supabase${context ? ' ' + context : ''}]:`, { code, message });

  return { code, message };
}

export function getSafeErrorMessage(error, fallback = 'حدث خطأ غير متوقع') {
  if (!error) return fallback;

  const code = error.code || '';

  const errorMap = {
    '23505': 'هذا العنصر موجود مسبقاً',
    '23503': 'المرجع غير موجود',
    '23514': 'البيانات لا تحقق الشروط',
    '42P01': 'الجدول غير موجود',
    '42501': 'لا تملك صلاحية لهذا الإجراء',
    'PGRST116': 'لم يتم العثور على نتائج',
  };

  if (errorMap[code]) return errorMap[code];

  const message = String(error.message || '').toLowerCase();

  if (
    message.includes('failed to fetch') ||
    message.includes('network') ||
    message.includes('fetch')
  ) {
    return 'تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت وحاول مرة أخرى.';
  }

  if (message.includes('timeout')) {
    return 'انتهت مهلة الاتصال. حاول مرة أخرى.';
  }

  if (message.includes('invalid login credentials')) {
    return 'البريد أو كلمة المرور غير صحيحة';
  }

  if (message.includes('email not confirmed')) {
    return 'البريد غير مؤكد';
  }

  if (message.includes('too many requests')) {
    return 'محاولات كثيرة. حاول لاحقاً';
  }

  return fallback;
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
